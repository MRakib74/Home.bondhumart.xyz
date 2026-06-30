"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Order {
  id: string
  bondhumartId: string
  amount: number
  deliveryCharge: number
  quantity: number
  customer: {
    name: string
    phone: string
    address: string
    district: string
  }
  product: {
    name: string
  }
  createdAt: string
}

function InvoicePrintContent() {
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [config, setConfig] = useState({
    theme: 'bw',
    grid: '3x3',
    courierPosition: 'top-right',
    showSellerAddress: true,
    showCustomerPhone: true
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedConfig = localStorage.getItem('bondhu_invoice_config')
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (e) {}
    }

    const ids = searchParams.get('ids')
    if (ids) {
      fetch(`/api/website-management/orders?ids=${ids}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setOrders(data)
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    if (!loading && orders.length > 0) {
      setTimeout(() => {
        window.print()
      }, 500)
    }
  }, [loading, orders])

  if (loading) {
    return <div className="p-10 text-center font-bold">লোড হচ্ছে...</div>
  }

  if (orders.length === 0) {
    return <div className="p-10 text-center font-bold text-red-500">কোনো অর্ডার পাওয়া যায়নি। দয়া করে অর্ডার সিলেক্ট করে আবার চেষ্টা করুন।</div>
  }

  const isBW = config.theme === 'bw';
  const isCompact = config.grid === '3x3' || config.grid === '3x4';

  let gridCols = 'grid-cols-3'
  let rowsPerPage = 3
  
  if (config.grid === '3x4') {
    gridCols = 'grid-cols-3'
    rowsPerPage = 4
  } else if (config.grid === '2x3') {
    gridCols = 'grid-cols-2'
    rowsPerPage = 3
  } else {
    gridCols = 'grid-cols-3'
    rowsPerPage = 3
  }

  return (
    <div className={`print-container ${gridCols} grid`}>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: grid;
            gap: 2mm;
            padding: 5mm;
          }
          .page-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
        body { background: white; margin: 0; padding: 0; }
      `}} />

      {orders.map((order, index) => (
        <div 
          key={index} 
          className="page-break"
          style={{
            height: \`calc((100vh - 10mm - (\${rowsPerPage - 1} * 2mm)) / \${rowsPerPage})\`,
            border: isBW ? '1px solid #000' : '1px dashed #ccc',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#fff',
            color: '#000',
            fontFamily: 'sans-serif',
            fontSize: isCompact ? '9px' : '11px',
            boxSizing: 'border-box'
          }}
        >
          <div 
            style={{
              background: isBW ? '#fff' : 'linear-gradient(135deg, #0ea5e9, #10b981)',
              color: isBW ? '#000' : '#fff',
              borderBottom: isBW ? '2px solid #000' : 'none',
              padding: isCompact ? '6px 8px' : '8px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: isCompact ? '12px' : '14px', fontWeight: 800 }}>BondhuMart</h1>
              <p style={{ margin: '2px 0 0', fontSize: isCompact ? '8px' : '9px', opacity: 0.9 }}>Trusted Online Shop</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              {config.courierPosition === 'top-right' && (
                <div style={{ 
                  marginBottom: '4px', 
                  fontSize: isCompact ? '10px' : '12px', 
                  fontWeight: 900,
                  border: isBW ? '1px solid #000' : 'none',
                  background: isBW ? '#000' : 'rgba(255,255,255,0.2)',
                  color: isBW ? '#fff' : '#fff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
                  ID: {order.bondhumartId || order.id.slice(-6).toUpperCase()}
                </div>
              )}
              <div style={{
                background: isBW ? '#fff' : 'rgba(255,255,255,0.2)',
                color: isBW ? '#000' : '#fff',
                border: isBW ? '1px solid #000' : 'none',
                padding: '2px 6px',
                borderRadius: isBW ? '0' : '10px',
                fontWeight: 'bold',
                fontSize: isCompact ? '8px' : '9px',
                display: config.courierPosition === 'top-right' ? 'block' : 'inline-block'
              }}>
                DATE: {new Date(order.createdAt).toLocaleDateString('en-GB')}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid ' + (isBW ? '#000' : '#e4e4e7'),
            padding: isCompact ? '4px 6px' : '6px 10px',
            background: isBW ? '#fff' : '#fafafa',
            flexGrow: 1
          }}>
            {config.showSellerAddress && (
              <div style={{ width: '45%' }}>
                <div style={{ fontSize: isCompact ? '8px' : '9px', color: isBW ? '#000' : '#71717a', textTransform: 'uppercase', fontWeight: 'bold' }}>Seller</div>
                <div style={{ fontWeight: 600, fontSize: isCompact ? '9px' : '10px' }}>BondhuMart</div>
                <div style={{ color: isBW ? '#000' : '#52525b', fontSize: isCompact ? '8px' : '9px', marginTop: '2px' }}>Dhaka, Bangladesh</div>
              </div>
            )}
            <div style={{ 
              width: config.showSellerAddress ? '50%' : '100%',
              borderLeft: config.showSellerAddress ? (isBW ? '1px solid #000' : '2px solid #10b981') : 'none',
              paddingLeft: config.showSellerAddress ? '6px' : '0'
            }}>
              <div style={{ fontSize: isCompact ? '8px' : '9px', color: isBW ? '#000' : '#71717a', textTransform: 'uppercase', fontWeight: 'bold' }}>Customer</div>
              <div style={{ fontWeight: 600, fontSize: isCompact ? '9px' : '10px', textTransform: 'uppercase' }}>{order.customer?.name || 'Customer'}</div>
              {config.showCustomerPhone && (
                <div style={{ color: isBW ? '#000' : '#0ea5e9', fontWeight: 'bold' }}>📞 {order.customer?.phone}</div>
              )}
              <div style={{ fontSize: isCompact ? '8px' : '9.5px', marginTop: '2px', lineHeight: 1.25 }}>
                {order.customer?.address}
                {order.customer?.district ? \`, \${order.customer.district}\` : ''}
              </div>
            </div>
          </div>

          <div style={{ padding: '0 6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '4px' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid ' + (isBW?'#000':'#e4e4e7'), textAlign: 'left', fontSize: isCompact?'8px':'9px' }}>PRODUCT</th>
                  <th style={{ borderBottom: '1px solid ' + (isBW?'#000':'#e4e4e7'), textAlign: 'center', fontSize: isCompact?'8px':'9px' }}>QTY</th>
                  <th style={{ borderBottom: '1px solid ' + (isBW?'#000':'#e4e4e7'), textAlign: 'right', fontSize: isCompact?'8px':'9px' }}>PRICE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ borderBottom: '1px dashed ' + (isBW?'#000':'#e4e4e7'), padding: '4px 0', fontSize: isCompact?'9px':'10px', fontWeight: 600 }}>{order.product?.name || 'Product'} (x{order.quantity || 1})</td>
                  <td style={{ borderBottom: '1px dashed ' + (isBW?'#000':'#e4e4e7'), textAlign: 'center', padding: '4px 0' }}>{order.quantity || 1}</td>
                  <td style={{ borderBottom: '1px dashed ' + (isBW?'#000':'#e4e4e7'), textAlign: 'right', padding: '4px 0' }}>৳ {order.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ padding: isCompact ? '2px 6px 4px 6px' : '4px 10px 8px 10px', borderTop: '1px solid ' + (isBW?'#000':'#e4e4e7') }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isCompact?'9px':'10px', fontWeight: 'bold' }}><span>Subtotal</span><span>৳ {order.amount}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isCompact?'9px':'10px', fontWeight: 'bold', margin: '1px 0' }}><span>Delivery</span><span>৳ {order.deliveryCharge || 0}</span></div>
            <div style={{ 
              background: isBW ? '#000' : '#18181b', 
              color: '#fff', 
              padding: '4px 6px', 
              borderRadius: isBW ? '0' : '4px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontWeight: 'bold', 
              marginTop: '2px',
              fontSize: isCompact ? '10px' : '12px'
            }}>
              <span>TOTAL (COD)</span>
              <span style={{ color: isBW ? '#fff' : '#10b981' }}>৳ {order.amount + (order.deliveryCharge || 0)}</span>
            </div>
          </div>

          {config.courierPosition === 'bottom' && (
            <div style={{ 
              textAlign: 'center', 
              background: isBW ? '#fff' : '#f4f4f5', 
              padding: '4px', 
              margin: '4px 6px 6px 6px', 
              border: isBW ? '1px solid #000' : '1px dashed #d4d4d8', 
              fontWeight: 'bold',
              fontSize: isCompact ? '9px' : '10px'
            }}>
              ID: {order.bondhumartId || order.id.slice(-6).toUpperCase()}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function PrintInvoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoicePrintContent />
    </Suspense>
  )
}
