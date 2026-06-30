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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customerName, phone, address, district, product, quantity, amount, deliveryCharge, status } = body

    if (!phone || !customerName) {
      return NextResponse.json({ error: 'Customer name and phone required' }, { status: 400 })
    }

    // Upsert customer
    let cust = await prisma.customer.findUnique({ where: { phone } })
    if (!cust) {
      cust = await prisma.customer.create({
        data: { name: customerName, phone, address, district, totalOrders: 1, totalSpent: Number(amount) || 0, lastOrderAt: new Date() }
      })
    } else {
      cust = await prisma.customer.update({
        where: { id: cust.id },
        data: { 
          name: customerName, 
          address: address || cust.address, 
          district: district || cust.district,
          totalOrders: { increment: 1 },
          totalSpent: { increment: Number(amount) || 0 },
          lastOrderAt: new Date()
        }
      })
    }

    // Find or create product
    let prod = await prisma.product.findFirst({ where: { name: product || 'Unknown Product' } })
    if (!prod) {
      prod = await prisma.product.create({
        data: { name: product || 'Unknown Product', price: Number(amount) || 0, bondhumartId: 'P-WM-' + Date.now() }
      })
    }

    // Create order
    const newOrder = await prisma.order.create({
      data: {
        bondhumartId: 'WM-' + Date.now().toString().slice(-8),
        customerId: cust.id,
        productId: prod.id,
        quantity: Number(quantity) || 1,
        amount: Number(amount) || 0,
        deliveryCharge: Number(deliveryCharge) || 0,
        status: status || 'Pending',
        customData: { source: 'Manual Entry' }
      },
      include: { customer: true, product: true }
    })

    return NextResponse.json({ success: true, order: newOrder })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { action } = body

    // Single order edit
    if (action === 'edit_single') {
      const { orderId, customerName, phone, address, district, product, quantity, amount, deliveryCharge } = body
      
      const existingOrder = await prisma.order.findUnique({ where: { id: orderId } })
      if (!existingOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

      // Update customer
      await prisma.customer.update({
        where: { id: existingOrder.customerId },
        data: { name: customerName, phone, address, district }
      })

      // Find or create product
      let prod = await prisma.product.findFirst({ where: { name: product } })
      if (!prod) {
        prod = await prisma.product.create({
          data: { name: product, price: Number(amount), bondhumartId: 'P-WM-' + Date.now() }
        })
      }

      // Update order
      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          productId: prod.id,
          quantity: Number(quantity) || 1,
          amount: Number(amount),
          deliveryCharge: Number(deliveryCharge) || 0
        },
        include: { customer: true, product: true }
      })

      return NextResponse.json({ success: true, order: updated })
    }

    // Bulk status change
    if (action === 'status_change') {
      const { orderIds, status } = body

      if (!orderIds || !Array.isArray(orderIds)) {
        return NextResponse.json({ error: 'orderIds array is required' }, { status: 400 })
      }

      // Get templates
      const templates = await prisma.notificationTemplate.findMany({
        where: { isActive: true }
      })
      
      // Update DB
      await prisma.order.updateMany({
        where: { id: { in: orderIds } },
        data: { 
          status,
          deliveredAt: status === 'Delivered' ? new Date() : undefined
        }
      })

      // Send Notifications
      const updatedOrders = await prisma.order.findMany({
        where: { id: { in: orderIds } },
        include: { customer: true }
      })

      for (const order of updatedOrders) {
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

    // Delete courier bookings first
    await prisma.courierBooking.deleteMany({ where: { orderId: { in: orderIds } } })
    await prisma.order.deleteMany({
      where: { id: { in: orderIds } }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete orders' }, { status: 500 })
  }
}
