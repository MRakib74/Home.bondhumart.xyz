import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendOrderNotification } from '@/lib/notifier'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    
    let whereClause = {}
    if (status && status !== 'all') {
      whereClause = {
        status: {
          equals: status,
          mode: 'insensitive'
        }
      }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        customer: true,
        product: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { orderIds, status, action } = body

    if (!orderIds || !Array.isArray(orderIds)) {
      return NextResponse.json({ error: 'orderIds array is required' }, { status: 400 })
    }

    if (action === 'status_change' && status) {
      // Get templates
      const templates = await prisma.notificationTemplate.findMany({
        where: { isActive: true }
      })
      
      // Update DB
      await prisma.order.updateMany({
        where: { id: { in: orderIds } },
        data: { status }
      })

      // Send Notifications
      const updatedOrders = await prisma.order.findMany({
        where: { id: { in: orderIds } },
        include: { customer: true }
      })

      for (const order of updatedOrders) {
        // Find matching template (e.g. 'Order Confirmed', 'Order Cancelled')
        const template = templates.find(t => t.type.toLowerCase().includes(status.toLowerCase()))
        
        if (template && order.customer?.phone) {
          let msg = template.message
            .replace('{name}', order.customer.name || 'Customer')
            .replace('{order_id}', order.bondhumartId || order.id)
            .replace('{amount}', order.amount.toString())
            .replace('{invoice_url}', `https://command.bondhumart.xyz/invoice/${order.id}`)

          await sendOrderNotification(order, msg)
        }
      }

      return NextResponse.json({ success: true, updated: updatedOrders.length })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update orders' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { orderIds } = body

    if (!orderIds || !Array.isArray(orderIds)) {
      return NextResponse.json({ error: 'orderIds array is required' }, { status: 400 })
    }

    await prisma.order.deleteMany({
      where: { id: { in: orderIds } }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete orders' }, { status: 500 })
  }
}
