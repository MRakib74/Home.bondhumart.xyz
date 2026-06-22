import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const blocked = await prisma.blockedCustomer.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(blocked)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blocked customers' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, reason } = body

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    // Check if already blocked
    const existing = await prisma.blockedCustomer.findUnique({ where: { phone } })
    if (existing) {
      return NextResponse.json({ error: 'This number is already blocked' }, { status: 400 })
    }

    const blocked = await prisma.blockedCustomer.create({
      data: { name, phone, reason }
    })

    return NextResponse.json(blocked)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to block customer' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.blockedCustomer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unblock customer' }, { status: 500 })
  }
}
