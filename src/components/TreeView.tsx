'use client'
import { FileNode } from '@/lib/RepoProcessor'
import { ChevronRight, ChevronDown, FileText, Folder } from 'lucide-react'
import { useState } from 'react'

export default function FileTree ({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1) // root open
  if (node.type === 'file') {
    return (
      <div className="flex items-center pl-4 text-sm">
        <FileText className="mr-2 h-4 w-4 shrink-0" />
        {node.name}
      </div>
    )
  }
  return (
    <div className="pl-4">
      <button
        className="flex items-center text-sm font-medium hover:underline"
        onClick={() => setOpen(o => !o)}
      >
        {open ? <ChevronDown className="mr-1 h-4 w-4" /> : <ChevronRight className="mr-1 h-4 w-4" />}
        <Folder className="mr-2 h-4 w-4" /> {node.name}
      </button>
      {open && node.children?.map(child => (
        <FileTree key={child.path} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}
