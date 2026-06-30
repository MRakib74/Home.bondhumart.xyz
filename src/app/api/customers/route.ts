import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { product: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    const formattedCustomers = customers.map(c => {
      const lastOrder = c.orders[0];
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email || '',
        district: c.district || '',
        thana: c.thana || '',
        address: c.address || '',
        product: lastOrder ? lastOrder.product?.name || '' : '',
        orderId: lastOrder ? lastOrder.id : '',
        deliveryCharge: lastOrder ? lastOrder.deliveryCharge : 0,
        totalOrders: c.totalOrders,
        totalSpent: c.totalSpent,
        date: c.createdAt.toISOString(),
        status: lastOrder ? lastOrder.status : 'Raw Leads 📱'
      }
    })

    return NextResponse.json(formattedCustomers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customers } = body

    if (!Array.isArray(customers)) {
      return NextResponse.json({ error: 'Invalid data format, expected array of customers' }, { status: 400 })
    }

    let importedCount = 0;

    for (const data of customers) {
      if (!data.phone) continue;

      // Ensure product exists if provided
      let prodId = null;
      if (data.product) {
        let prod = await prisma.product.findFirst({ where: { name: data.product } })
        if (!prod) {
          prod = await prisma.product.create({
            data: { name: data.product, price: Number(data.totalSpent) || 0, bondhumartId: 'P-IMP-' + Date.now() + Math.floor(Math.random() * 1000) }
          })
        }
        prodId = prod.id;
      }

      // Upsert customer
      let cust = await prisma.customer.findUnique({ where: { phone: data.phone } })
      
      if (!cust) {
        cust = await prisma.customer.create({
          data: {
            name: data.name || 'Unknown',
            phone: data.phone,
            email: data.email,
            district: data.district,
            thana: data.thana,
            address: data.address,
            totalOrders: data.totalOrders || 1,
            totalSpent: data.totalSpent || 0,
          }
        })
      } else {
        cust = await prisma.customer.update({
          where: { id: cust.id },
          data: {
            name: data.name || cust.name,
            address: data.address || cust.address,
            district: data.district || cust.district,
            thana: data.thana || cust.thana,
            totalOrders: cust.totalOrders + (data.totalOrders || 1),
            totalSpent: cust.totalSpent + (data.totalSpent || 0)
          }
        })
      }

      // Create order if applicable
      if (prodId) {
        await prisma.order.create({
          data: {
            customerId: cust.id,
            productId: prodId,
            amount: Number(data.totalSpent) || 0,
            deliveryCharge: Number(data.deliveryCharge) || 0,
            status: data.status ? data.status.split(' ')[0] : 'Pending', // Strip emojis from status like 'Confirmed 🔵'
            bondhumartId: data.orderId || 'ORD-IMP-' + Date.now() + Math.floor(Math.random() * 1000),
            customData: { source: 'Excel Import' }
          }
        })
      }
      
      importedCount++;
    }

    return NextResponse.json({ success: true, count: importedCount })
  } catch (error) {
    console.error('Error importing customers:', error)
    return NextResponse.json({ error: 'Failed to import customers' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, name, phone, email, district, thana, address } = body

    if (!id) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }

    await prisma.customer.update({
      where: { id },
      data: { name, phone, email, district, thana, address }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const idsStr = searchParams.get('ids')

    if (!idsStr) {
      return NextResponse.json({ error: 'Customer IDs required' }, { status: 400 })
    }

    const ids = idsStr.split(',')

    // We must handle related orders and chatLogs to safely delete the customer
    // Find all orders for these customers
    const orders = await prisma.order.findMany({ where: { customerId: { in: ids } } })
    const orderIds = orders.map(o => o.id)

    if (orderIds.length > 0) {
      // Delete associated courier bookings first
      await prisma.courierBooking.deleteMany({ where: { orderId: { in: orderIds } } })
      // Delete orders
      await prisma.order.deleteMany({ where: { id: { in: orderIds } } })
    }

    // Delete chat logs associated by phone
    const customers = await prisma.customer.findMany({ where: { id: { in: ids } } })
    const phones = customers.map(c => c.phone).filter(Boolean)
    if (phones.length > 0) {
      await prisma.chatLog.deleteMany({ where: { customerPhone: { in: phones } } })
    }

    // Finally delete customers
    await prisma.customer.deleteMany({ where: { id: { in: ids } } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting customers:', error)
    return NextResponse.json({ error: 'Failed to delete customers' }, { status: 500 })
  }
}
