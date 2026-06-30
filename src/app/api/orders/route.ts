import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        product: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Format orders for the UI
    const formattedOrders = orders.map(o => ({
      id: o.id,
      customerName: o.customer.name,
      phone: o.customer.phone,
      address: o.customer.address || '',
      district: o.customer.district || '',
      product: o.product.name,
      quantity: o.quantity,
      amount: o.amount,
      deliveryCharge: o.deliveryCharge,
      status: o.status.toLowerCase(), // UI expects lowercase statuses
      source: o.customData ? (o.customData as any).source || 'Website' : 'Website',
      courierName: o.courierName,
      trackingNo: o.courierTracking,
      consignmentId: (o.customData as any)?.consignmentId,
      createdAt: o.createdAt.toISOString(),
      shippedAt: o.deliveredAt ? o.deliveredAt.toISOString() : undefined
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Handle bulk import
    if (body.orders && Array.isArray(body.orders)) {
      let importedCount = 0;
      for (const orderData of body.orders) {
        if (!orderData.phone) continue;

        // 1. Find or create customer
        let cust = await prisma.customer.findUnique({ where: { phone: orderData.phone } })
        if (!cust) {
          cust = await prisma.customer.create({
            data: { 
              name: orderData.customerName || 'Unknown', 
              phone: orderData.phone, 
              address: orderData.address, 
              district: orderData.district 
            }
          })
        } else if (!cust.address && orderData.address) {
          cust = await prisma.customer.update({
            where: { id: cust.id },
            data: { address: orderData.address, district: orderData.district, name: orderData.customerName }
          })
        }

        // 2. Find or create product
        let prod = await prisma.product.findFirst({ where: { name: orderData.product } })
        if (!prod) {
          prod = await prisma.product.create({
            data: { name: orderData.product || 'Unknown Product', price: Number(orderData.amount) || 0, bondhumartId: 'P-IMP-' + Date.now() + Math.floor(Math.random() * 1000) }
          })
        }

        // 3. Create Order
        await prisma.order.create({
          data: {
            bondhumartId: 'ORD-IMP-' + Date.now().toString() + Math.floor(Math.random() * 1000).toString(),
            customerId: cust.id,
            productId: prod.id,
            quantity: Number(orderData.quantity) || 1,
            amount: Number(orderData.amount) || 0,
            deliveryCharge: Number(orderData.deliveryCharge) || 0,
            status: orderData.status === 'new' ? 'Pending' : (orderData.status === 'confirmed' ? 'Confirmed' : (orderData.status || 'Pending')),
            customData: { source: orderData.source || 'Website Import' }
          }
        })
        importedCount++;
      }
      return NextResponse.json({ success: true, count: importedCount })
    }

    // Handle single order creation
    const { 
      customerName, phone, address, district, 
      product, quantity, amount, deliveryCharge, 
      status, source 
    } = body

    // 1. Find or create customer
    let cust = await prisma.customer.findUnique({ where: { phone } })
    if (!cust) {
      cust = await prisma.customer.create({
        data: { name: customerName, phone, address, district }
      })
    } else {
      // Update details if empty
      if (!cust.address && address) {
        cust = await prisma.customer.update({
          where: { id: cust.id },
          data: { address, district, name: customerName }
        })
      }
    }

    // 2. Find or create product
    let prod = await prisma.product.findFirst({ where: { name: product } })
    if (!prod) {
      prod = await prisma.product.create({
        data: { name: product, price: amount, bondhumartId: 'P-' + Date.now() }
      })
    }

    // 3. Create Order
    const newOrder = await prisma.order.create({
      data: {
        bondhumartId: 'ORD-' + Date.now().toString() + Math.floor(Math.random() * 1000).toString(),
        customerId: cust.id,
        productId: prod.id,
        quantity: Number(quantity) || 1,
        amount: Number(amount),
        deliveryCharge: Number(deliveryCharge),
        status: status === 'new' ? 'Pending' : (status === 'confirmed' ? 'Confirmed' : status),
        customData: { source: source || 'Manual' }
      }
    })

    return NextResponse.json({ success: true, orderId: newOrder.id })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === 'update_status_bulk') {
      const { orderIds, status } = body
      if (!Array.isArray(orderIds)) return NextResponse.json({ error: 'orderIds must be an array' }, { status: 400 })
      
      const dbStatus = status === 'confirmed' ? 'Confirmed' : status
      
      await prisma.order.updateMany({
        where: { id: { in: orderIds } },
        data: { status: dbStatus }
      })
      return NextResponse.json({ success: true })
    }

    if (action === 'update_courier_bulk') {
      const { ordersData } = body
      if (!Array.isArray(ordersData)) return NextResponse.json({ error: 'ordersData must be an array' }, { status: 400 })
      
      // Update each order's courier info
      for (const o of ordersData) {
        // Fetch existing customData to preserve it
        const existingOrder = await prisma.order.findUnique({ where: { id: o.id } })
        let newCustomData = existingOrder?.customData as any || {}
        if (o.consignmentId) newCustomData.consignmentId = o.consignmentId
        
        await prisma.order.update({
          where: { id: o.id },
          data: {
            status: 'Shipped',
            courierName: o.courierName,
            courierTracking: o.trackingNo,
            deliveredAt: o.shippedAt ? new Date(o.shippedAt) : new Date(),
            customData: newCustomData
          }
        })
      }
      return NextResponse.json({ success: true })
    }
    
    if (action === 'update_single') {
      const { orderId, customerName, phone, address, district, product, quantity, amount, deliveryCharge } = body
      
      const existingOrder = await prisma.order.findUnique({ where: { id: orderId } })
      if (!existingOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

      // Update Customer
      await prisma.customer.update({
        where: { id: existingOrder.customerId },
        data: { name: customerName, phone, address, district }
      })

      // We might need to update product link if product changed, but let's just create/find product
      let prod = await prisma.product.findFirst({ where: { name: product } })
      if (!prod) {
        prod = await prisma.product.create({
          data: { name: product, price: amount, bondhumartId: 'P-' + Date.now() }
        })
      }

      // Update Order
      await prisma.order.update({
        where: { id: orderId },
        data: {
          productId: prod.id,
          quantity: Number(quantity),
          amount: Number(amount),
          deliveryCharge: Number(deliveryCharge)
        }
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const idsStr = searchParams.get('ids')

    if (id) {
      // Since order has courierBookings, we should delete them first if they exist
      await prisma.courierBooking.deleteMany({ where: { orderId: id } })
      await prisma.order.delete({ where: { id } })
      return NextResponse.json({ success: true })
    }
    
    if (idsStr) {
      const ids = idsStr.split(',')
      await prisma.courierBooking.deleteMany({ where: { orderId: { in: ids } } })
      await prisma.order.deleteMany({ where: { id: { in: ids } } })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Order ID(s) required' }, { status: 400 })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
