import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const templates = await prisma.notificationTemplate.findMany({
      orderBy: { type: 'asc' }
    })
    
    // If empty, let's create defaults
    if (templates.length === 0) {
      const defaults = [
        { type: 'Order Received', message: 'প্রিয় {name},\nআপনার অর্ডারটি (#BM-{order_id}) সফলভাবে গ্রহণ করা হয়েছে।\nমোট বিল: {amount}\nআপনার ইনভয়েস: {invoice_url}', isActive: true },
        { type: 'Order Confirmed', message: 'সুখবর {name}! 🎉\nআপনার অর্ডার (#BM-{order_id}) কনফার্ম হয়েছে।\nমোট বিল: {amount} টাকা।\nআপনার ইনভয়েস: {invoice_url}', isActive: true },
        { type: 'Order Cancelled', message: 'প্রিয় {name},\nদুঃখিত, আপনার অর্ডার (#BM-{order_id}) বাতিল করা হয়েছে।', isActive: false },
        { type: 'Order Shipped', message: 'দারুণ খবর {name}! 🚚\nআপনার অর্ডারটি (#BM-{order_id}) কুরিয়ারে দেওয়া হয়েছে। খুব শীঘ্রই পেয়ে যাবেন।', isActive: true },
      ]
      
      for (const d of defaults) {
        await prisma.notificationTemplate.create({ data: d })
      }
      
      const newTemplates = await prisma.notificationTemplate.findMany({ orderBy: { type: 'asc' } })
      return NextResponse.json(newTemplates)
    }

    return NextResponse.json(templates)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, isActive, message, channel } = body

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const updated = await prisma.notificationTemplate.update({
      where: { id },
      data: { isActive, message, channel }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
  }
}
