'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import FileTree from '@/components/TreeView'
import { FileNode } from '@/lib/RepoProcessor'

export default function HomePage () {
  const [url, setUrl] = useState('')
  const [tree, setTree] = useState<FileNode | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    if (!url) return
    setLoading(true)
    setTree(null)
    setText('')
    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: url })
      })
      const json = await res.json()
      if (res.ok) {
        setTree(json.tree)
        setText(json.combined)
        // trigger download automatically
        const blob = new Blob([json.combined], { type: 'text/plain' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'combined.txt'
        a.click()
        URL.revokeObjectURL(a.href)
      } else {
        alert(json.error || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-3xl font-bold">Repo Flattener</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://github.com/user/repo" />
        <Button disabled={loading}>{loading ? 'Processing…' : 'Go'}</Button>
      </form>

      {tree && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h2 className="mb-2 text-xl font-semibold">File Tree</h2>
            <FileTree node={tree} />
          </CardContent>
        </Card>
      )}

      {text && (
        <Card className="mt-6">
          <CardContent className="p-4 prose max-w-none">
            <h2 className="text-xl font-semibold">Combined Preview</h2>
            <pre className="whitespace-pre-wrap text-xs leading-tight">{text.slice(0, 10000)}…</pre>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
