import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const logs = await prisma.messageLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Limit to latest 100 for performance
    })
    return NextResponse.json(logs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      // Delete single
      await prisma.messageLog.delete({ where: { id } })
    } else {
      // Clear all
      await prisma.messageLog.deleteMany({})
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete logs' }, { status: 500 })
  }
}
