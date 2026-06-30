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
      // Delay printing slightly so fonts/images can load
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

  // Determine grid class based on config
  let gridCols = 'grid-cols-3'
  let heightClass = 'h-[33.33vh]' // For 3 rows per page (e.g. 3x3)
  
  if (config.grid === '3x4') {
    gridCols = 'grid-cols-3'
    heightClass = 'h-[25vh]' // 4 rows per page
  } else if (config.grid === '2x3') {
    gridCols = 'grid-cols-2'
    heightClass = 'h-[33.33vh]' // 3 rows per page
  } else {
    // 3x3
    gridCols = 'grid-cols-3'
    heightClass = 'h-[33.33vh]'
  }

  // Theme colors
  const borderColor = config.theme === 'color' ? 'border-blue-500' : 'border-black'
  const titleColor = config.theme === 'color' ? 'text-blue-600' : 'text-black'
  const bgHeader = config.theme === 'color' ? 'bg-blue-50' : 'bg-gray-100'

  return (
    <div className={`print-container ${gridCols} grid`}>
      {/* 
        Global Print CSS:
        We use raw CSS to hide everything else and style the page for A4 printing.
      */}
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
        <div key={index} className={`page-break border ${borderColor} p-3 flex flex-col justify-between ${heightClass} relative overflow-hidden bg-white`}>
          
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className={`font-bold text-lg leading-tight ${titleColor}`}>BondhuMart</h1>
              {config.showSellerAddress && (
                <p className="text-[10px] text-gray-600 mt-1 leading-tight">
                  Mirpur 10, Dhaka<br />
                  Phone: 01819XXXXXX
                </p>
              )}
            </div>
            
            {/* Courier ID Position: Top Right */}
            {config.courierPosition === 'top-right' && (
              <div className="text-right">
                <div className="border border-black px-2 py-1 text-xs font-bold whitespace-nowrap">
                  Invoice: {order.bondhumartId || order.id.slice(-6).toUpperCase()}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString('en-GB')}
                </div>
              </div>
            )}
          </div>

          {/* Customer Details */}
          <div className={`p-2 rounded border ${borderColor} ${bgHeader} flex-grow mb-2`}>
            <p className="text-xs font-bold text-gray-500 mb-1 border-b border-gray-300 pb-1">DELIVER TO</p>
            <h2 className="font-bold text-sm leading-tight uppercase">{order.customer?.name || 'Customer'}</h2>
            {config.showCustomerPhone && (
              <p className="text-xs font-bold my-1">📞 {order.customer?.phone}</p>
            )}
            <p className="text-xs leading-tight line-clamp-3">
              {order.customer?.address}
              {order.customer?.district ? `, ${order.customer.district}` : ''}
            </p>
          </div>

          {/* Product & Amount Details */}
          <div className="border border-gray-300 rounded text-xs">
            <div className="flex justify-between border-b border-gray-300 p-1 bg-gray-50 font-bold">
              <span>Item</span>
              <span>Qty</span>
            </div>
            <div className="flex justify-between p-1">
              <span className="line-clamp-2 pr-2">{order.product?.name || 'Product'}</span>
              <span className="font-bold">{order.quantity || 1}</span>
            </div>
            <div className="flex justify-between border-t border-gray-300 p-1">
              <span>Delivery</span>
              <span>৳{order.deliveryCharge || 0}</span>
            </div>
            <div className="flex justify-between border-t border-gray-300 p-1 font-bold text-sm bg-gray-100">
              <span>Total Collect</span>
              <span>৳{order.amount + (order.deliveryCharge || 0)}</span>
            </div>
          </div>

          {/* Footer - Courier ID Position: Bottom */}
          {config.courierPosition === 'bottom' && (
             <div className="mt-2 text-center border-t border-dashed border-gray-400 pt-2 text-xs font-bold">
                Invoice: {order.bondhumartId || order.id.slice(-6).toUpperCase()}
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
