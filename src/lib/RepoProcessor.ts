import path from 'node:path'
import { tmpdir } from 'node:os'
import { mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { promises as fs } from 'node:fs'
import simpleGit from 'simple-git'
import recursive from 'recursive-readdir'
import { fileTypeFromBuffer } from 'file-type'

export interface FileNode {
  name: string
  path: string
  type: 'file' | 'dir'
  children?: FileNode[]
}

export async function processRepo (repoUrl: string) {
  // 1️⃣ Create a temp workdir and clone
  const workDir = await mkdtemp(path.join(tmpdir(), 'repo-'))
  const git = simpleGit()
  await git.clone(repoUrl, workDir, ['--depth', '1'])

  // 2️⃣ Walk files (skip dot‑folders)
  const rawFiles: string[] = await recursive(workDir, [ (file) => /(^|\/)\.git/.test(file) ])

  // 3️⃣ Build tree + combine readable text
  const root: FileNode = { name: path.basename(repoUrl, '.git'), path: '', type: 'dir', children: [] }
  const combinedParts: string[] = []

  for (const filePath of rawFiles) {
    const rel = path.relative(workDir, filePath)
    // Skip large (>1 MB) binaries quickly
    const stat = await fs.stat(filePath)
    if (stat.size > 1024 * 1024) continue

    const buf = await readFile(filePath)
    const ft = await fileTypeFromBuffer(buf)
    if (ft?.mime.startsWith('image/') || ft?.mime.startsWith('audio/') || ft?.mime.startsWith('video/')) {
      continue // non‑text
    }

    // Append to combined with nice header
    combinedParts.push(`\n\n/*──────────────── ${rel} ────────────────*/\n`)
    combinedParts.push(buf.toString('utf8'))

    // Build tree nodes
    const segments = rel.split(path.sep)
    let cursor = root
    for (const [i, segment] of segments.entries()) {
      let next = cursor.children!.find(c => c.name === segment)
      if (!next) {
        next = {
          name: segment,
          path: path.join(cursor.path, segment),
          type: i === segments.length - 1 ? 'file' : 'dir',
          children: i === segments.length - 1 ? undefined : []
        }
        cursor.children!.push(next)
      }
      if (next.type === 'dir') cursor = next
    }
  }

  const combinedTxt = combinedParts.join('\n')
  const combinedPath = path.join(workDir, 'combined.txt')
  await writeFile(combinedPath, combinedTxt, 'utf8')

  return { root, combinedTxt }
}
