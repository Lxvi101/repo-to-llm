import { NextRequest, NextResponse } from 'next/server'
import { processRepo } from '@/lib/RepoProcessor'

export async function POST (req: NextRequest) {
  const { repoUrl } = await req.json()
  if (!repoUrl) return NextResponse.json({ error: 'Missing repoUrl' }, { status: 400 })
  try {
    const { root, combinedTxt } = await processRepo(repoUrl)
    return NextResponse.json({ tree: root, combined: combinedTxt })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
