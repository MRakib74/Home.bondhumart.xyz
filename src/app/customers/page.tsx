"use client"

import { useState } from "react"
import { Search, Download, Upload, Filter, X, FileSpreadsheet, CheckCircle2, Edit2, Save, MessageCircle, User, MapPin, Package, ShoppingBag, Calendar, ArrowRight } from "lucide-react"
import * as XLSX from "xlsx"

// Extended mock data based on user requirements
const initialCustomers = [
  { id: 1, name: "Rakib Raja", phone: "01819000000", email: "rakib@example.com", district: "Dhaka", thana: "Mirpur", address: "Mirpur 10", product: "AI Course", orderId: "ORD-101", deliveryCharge: 60, totalOrders: 5, totalSpent: 12500, date: "15 Jun 2026", status: "Delivered 🟢" },
  { id: 2, name: "Tanvir Ahmed", phone: "01712000000", email: "tanvir@example.com", district: "Chattogram", thana: "Panchlaish", address: "O.R. Nizam Road", product: "Web Dev Course", orderId: "ORD-102", deliveryCharge: 100, totalOrders: 1, totalSpent: 1200, date: "14 Jun 2026", status: "Pending 🟡" },
  { id: 3, name: "Sajid Hasan", phone: "01614000000", email: "", district: "Sylhet", thana: "Zindabazar", address: "Zindabazar Road", product: "SEO Mastery", orderId: "ORD-103", deliveryCharge: 120, totalOrders: 2, totalSpent: 3400, date: "10 Jun 2026", status: "Returned 🟣" },
  { id: 4, name: "Mehedi", phone: "01915000000", email: "", district: "", thana: "", address: "", product: "", orderId: "", deliveryCharge: 0, totalOrders: 0, totalSpent: 0, date: "-", status: "Raw Leads 📱" },
]

const TABS = ['All', 'Pending 🟡', 'Confirmed 🔵', 'Delivered 🟢', 'Returned 🟣', 'Hold 🟠', 'Cancelled 🔴', 'Raw Leads 📱']

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Custom Columns Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [visibleCols, setVisibleCols] = useState({
    customerInfo: true,
    orderId: true,
    product: true,
    address: true,
    delivery: true,
    amount: true,
    date: true,
    status: true,
  })

  // CSV/Excel Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadStep, setUploadStep] = useState(1) // 1 = Upload, 2 = Map Columns
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [fileHeaders, setFileHeaders] = useState<string[]>([])
  const [uploadTargetSegment, setUploadTargetSegment] = useState('')
  const [colMap, setColMap] = useState({
    name: "", phone: "", address: "", product: "", orderId: "", deliveryCharge: "", totalSpent: "", date: ""
  })

  // Customer Details / Edit Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [detailsForm, setDetailsForm] = useState<any>({})

  // Handle File Upload & Parse with XLSX
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[sheetName]
          const json = XLSX.utils.sheet_to_json(sheet)
          
          if (json.length > 0) {
            setParsedData(json)
            setFileHeaders(Object.keys(json[0] as object))
          }
        } catch (error) {
          alert("File parsing failed. Please upload a valid CSV or XLSX file.")
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  // Handle Dynamic Mapping Submission
  const handleProcessMappedCsv = () => {
    if (!uploadTargetSegment) {
      alert("দয়া করে একটি স্ট্যাটাস সেগমেন্ট সিলেক্ট করুন!")
      return
    }
    
    // Map the JSON data according to user's selected column map
    const newCustomers = parsedData.map((row, index) => ({
      id: Date.now() + index,
      name: colMap.name ? row[colMap.name] : "Unknown",
      phone: colMap.phone ? String(row[colMap.phone]) : "No Phone",
      email: "",
      district: "",
      thana: "",
      address: colMap.address ? row[colMap.address] : "",
      product: colMap.product ? row[colMap.product] : "",
      orderId: colMap.orderId ? String(row[colMap.orderId]) : `NEW-${Date.now().toString().slice(-4)}`,
      deliveryCharge: colMap.deliveryCharge ? Number(row[colMap.deliveryCharge]) : 0,
      totalOrders: 1,
      totalSpent: colMap.totalSpent ? Number(row[colMap.totalSpent]) : 0,
      date: colMap.date ? String(row[colMap.date]) : new Date().toLocaleDateString('en-GB'),
      status: uploadTargetSegment
    }))

    setCustomers(prev => [...newCustomers, ...prev])
    resetUploadState()
    alert(`${newCustomers.length} জন কাস্টমার সফলভাবে '${uploadTargetSegment}' ট্যাবে আপলোড হয়েছে!`)
  }

  const resetUploadState = () => {
    setIsUploadModalOpen(false)
    setUploadStep(1)
    setSelectedFile(null)
    setParsedData([])
    setFileHeaders([])
    setUploadTargetSegment('')
    setColMap({ name: "", phone: "", address: "", product: "", orderId: "", deliveryCharge: "", totalSpent: "", date: "" })
  }

  // Handle Customer Row Click
  const openCustomerDetails = (customer: any) => {
    setSelectedCustomer(customer)
    setDetailsForm(customer)
    setIsEditingDetails(false)
  }

  const saveCustomerDetails = () => {
    setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? detailsForm : c))
    setSelectedCustomer(detailsForm)
    setIsEditingDetails(false)
  }

  // Filter customers based on active tab and search query
  const filteredCustomers = customers.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery) || 
                          c.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Helper to get matching header for initial dropdown state (smart guess)
  const getSmartGuess = (keywords: string[]) => {
    return fileHeaders.find(h => keywords.some(k => h.toLowerCase().includes(k))) || ""
  }

  // Generate Excel Export
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCustomers)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Customers")
    XLSX.writeFile(wb, `Bondhu_Customers_${activeTab}.xlsx`)
  }

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Customers & CRM</h2>
          <p className="text-zinc-400 mt-2">Manage all your leads, active customers, and AI segmentations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            <Upload className="h-4 w-4" />
            Import Data
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-800 flex flex-col gap-4 bg-zinc-900/50">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, or order ID..." 
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
              />
            </div>
            
            {/* Filter Custom Columns Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-300"
              >
                <Filter className="h-4 w-4" />
                Filter Custom Columns
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-20 p-2 animate-in fade-in zoom-in-95">
                  <div className="text-xs font-semibold text-zinc-500 uppercase px-3 py-2 mb-1">Visible Columns</div>
                  {Object.keys(visibleCols).map(col => (
                    <label key={col} className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={visibleCols[col as keyof typeof visibleCols]}
                        onChange={(e) => setVisibleCols({...visibleCols, [col]: e.target.checked})}
                        className="rounded bg-zinc-900 border-zinc-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-950 h-4 w-4"
                      />
                      <span className="text-sm text-zinc-300 capitalize">{col.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1 bg-zinc-950">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-zinc-900 border-b border-zinc-800 text-zinc-400 whitespace-nowrap">
              <tr>
                {visibleCols.customerInfo && <th className="px-6 py-4 font-medium">Customer Info</th>}
                {visibleCols.orderId && <th className="px-6 py-4 font-medium">Order ID</th>}
                {visibleCols.product && <th className="px-6 py-4 font-medium">Product</th>}
                {visibleCols.address && <th className="px-6 py-4 font-medium">Address</th>}
                {visibleCols.delivery && <th className="px-6 py-4 font-medium">Delivery</th>}
                {visibleCols.amount && <th className="px-6 py-4 font-medium">Amount</th>}
                {visibleCols.date && <th className="px-6 py-4 font-medium">Date</th>}
                {visibleCols.status && <th className="px-6 py-4 font-medium">Status</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-zinc-500">
                    No records found in "{activeTab}" segment.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => openCustomerDetails(customer)}
                    className="hover:bg-zinc-900/80 transition-colors group whitespace-nowrap cursor-pointer"
                  >
                    {/* CUSTOMER INFO */}
                    {visibleCols.customerInfo && (
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-100 group-hover:text-blue-400 transition-colors">{customer.name || "Unknown"}</div>
                        <div className="text-zinc-500 text-xs">{customer.phone}</div>
                      </td>
                    )}

                    {/* ORDER ID */}
                    {visibleCols.orderId && <td className="px-6 py-4 font-medium text-zinc-300">{customer.orderId || "-"}</td>}

                    {/* PRODUCT */}
                    {visibleCols.product && <td className="px-6 py-4 text-zinc-400">{customer.product || "-"}</td>}

                    {/* ADDRESS */}
                    {visibleCols.address && (
                      <td className="px-6 py-4">
                        {customer.district ? (
                          <>
                            <div className="text-zinc-200">{customer.district}, {customer.thana}</div>
                            <div className="text-zinc-500 text-xs truncate max-w-[150px]">{customer.address}</div>
                          </>
                        ) : (
                          <span className="text-zinc-600">{customer.address || "-"}</span>
                        )}
                      </td>
                    )}

                    {/* DELIVERY CHARGE */}
                    {visibleCols.delivery && <td className="px-6 py-4 text-zinc-400">{customer.deliveryCharge ? `৳ ${customer.deliveryCharge}` : "-"}</td>}

                    {/* TOTAL SPENT */}
                    {visibleCols.amount && <td className="px-6 py-4 font-medium text-blue-400">{customer.totalSpent ? `৳ ${customer.totalSpent.toLocaleString()}` : "-"}</td>}

                    {/* DATE */}
                    {visibleCols.date && <td className="px-6 py-4 text-zinc-400">{customer.date || "-"}</td>}

                    {/* STATUS */}
                    {visibleCols.status && (
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          customer.status.includes('Delivered') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          customer.status.includes('Returned') || customer.status.includes('Cancelled') ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          customer.status.includes('Pending') || customer.status.includes('Hold') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-sm text-zinc-500 bg-zinc-900 mt-auto">
          <div>Showing {filteredCustomers.length} of {customers.length} entries</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-zinc-800 rounded hover:bg-zinc-800 transition-colors disabled:opacity-50 text-zinc-300">Previous</button>
            <button className="px-3 py-1 border border-zinc-800 rounded hover:bg-zinc-800 transition-colors text-zinc-300">Next</button>
          </div>
        </div>
      </div>

      {/* 1. Upload CSV/Excel & Column Mapping Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Import Data (Excel/CSV)</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {uploadStep === 1 ? "Upload records directly into a specific segment." : "Map your file columns to BondhuOS fields."}
                </p>
              </div>
              <button onClick={resetUploadState} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Target Segment Selector (Always Visible) */}
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-200">Select Target Segment</label>
                <select 
                  value={uploadTargetSegment}
                  onChange={(e) => setUploadTargetSegment(e.target.value)}
                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Choose where to save these records --</option>
                  <option value="Pending 🟡">Pending 🟡</option>
                  <option value="Hold 🟠">Hold 🟠</option>
                  <option value="Confirmed 🔵">Confirmed 🔵</option>
                  <option value="Delivered 🟢">Delivered 🟢</option>
                  <option value="Returned 🟣">Returned 🟣</option>
                  <option value="Cancelled 🔴">Cancelled 🔴</option>
                </select>
              </div>

              {uploadStep === 1 ? (
                /* STEP 1: UPLOAD AREA */
                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-900 transition-colors cursor-pointer group relative bg-zinc-950 overflow-hidden">
                  <input 
                    type="file" 
                    accept=".csv, .xlsx, .xls"
                    title="Upload Excel or CSV"
                    className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                    style={{ color: "transparent" }}
                    onChange={handleFileUpload}
                  />
                  
                  {selectedFile && parsedData.length > 0 ? (
                    <>
                      <div className="p-4 bg-emerald-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                      </div>
                      <h4 className="font-semibold mb-1 text-emerald-400">{selectedFile.name}</h4>
                      <p className="text-sm text-zinc-400">{parsedData.length} rows found. Click 'Map Columns' to continue.</p>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-zinc-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                        <FileSpreadsheet className="h-8 w-8 text-zinc-400" />
                      </div>
                      <h4 className="font-semibold mb-1 text-zinc-200">Click or drag Excel/CSV file</h4>
                      <p className="text-sm text-zinc-500">Supported format: .xlsx, .xls, .csv</p>
                    </>
                  )}
                </div>
              ) : (
                /* STEP 2: DYNAMIC COLUMN MAPPING */
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="bg-blue-900/20 text-blue-400 p-3 rounded-lg text-sm border border-blue-900/50 mb-4">
                    Please map your file's columns to BondhuOS fields. If a field isn't in your file, leave it blank.
                  </div>
                  
                  {[
                    { id: 'name', label: 'Customer Name', req: true },
                    { id: 'phone', label: 'Phone Number', req: true },
                    { id: 'address', label: 'Full Address', req: false },
                    { id: 'product', label: 'Product Name', req: false },
                    { id: 'orderId', label: 'Order ID / Invoice', req: false },
                    { id: 'totalSpent', label: 'Total Amount / Price', req: false },
                    { id: 'date', label: 'Date', req: false }
                  ].map((field) => (
                    <div key={field.id} className="grid grid-cols-2 gap-4 items-center">
                      <label className="text-sm font-medium text-zinc-300">
                        {field.label} {field.req && <span className="text-rose-500">*</span>}
                      </label>
                      <select
                        value={colMap[field.id as keyof typeof colMap]}
                        onChange={(e) => setColMap({...colMap, [field.id]: e.target.value})}
                        className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="">-- Ignore this field --</option>
                        {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-3">
              <button 
                onClick={resetUploadState}
                className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-lg font-medium transition-colors text-zinc-300"
              >
                Cancel
              </button>
              
              {uploadStep === 1 ? (
                <button 
                  onClick={() => {
                    // Try to auto-guess mapping before moving to step 2
                    setColMap({
                      name: getSmartGuess(['name', 'customer']),
                      phone: getSmartGuess(['phone', 'mobile', 'contact']),
                      address: getSmartGuess(['address', 'location']),
                      product: getSmartGuess(['product', 'item']),
                      orderId: getSmartGuess(['order', 'invoice', 'id']),
                      deliveryCharge: getSmartGuess(['delivery', 'shipping', 'charge']),
                      totalSpent: getSmartGuess(['total', 'price', 'amount', 'spent']),
                      date: getSmartGuess(['date', 'time', 'created'])
                    })
                    setUploadStep(2)
                  }}
                  disabled={!selectedFile || parsedData.length === 0}
                  className={`px-4 py-2 flex items-center gap-2 rounded-lg font-medium transition-colors ${
                    !selectedFile || parsedData.length === 0 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Next: Map Columns <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button 
                  onClick={handleProcessMappedCsv}
                  disabled={!colMap.name || !colMap.phone}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !colMap.name || !colMap.phone 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  title={(!colMap.name || !colMap.phone) ? "Name and Phone are required to upload" : ""}
                >
                  Upload & Process
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Customer Details & Edit Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 sm:rounded-2xl w-full max-w-3xl sm:h-auto h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
            
            {/* Header (View vs Edit mode) */}
            <div className="p-6 border-b border-zinc-800 flex items-start justify-between bg-zinc-900/30">
              <div className="flex gap-4 items-center">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  {isEditingDetails ? (
                    <input 
                      type="text" 
                      value={detailsForm.name} 
                      onChange={e => setDetailsForm({...detailsForm, name: e.target.value})}
                      className="text-2xl font-bold bg-zinc-900 border border-zinc-700 rounded px-2 py-1 mb-1 focus:outline-none focus:border-blue-500 w-full"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-white">{selectedCustomer.name}</h2>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-1 bg-zinc-800 rounded text-xs font-medium text-zinc-300">
                      ID: {selectedCustomer.orderId || "N/A"}
                    </span>
                    <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs font-medium text-blue-400">
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isEditingDetails ? (
                  <>
                    {/* WhatsApp Action Button */}
                    <button className="flex items-center gap-2 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-lg font-medium hover:bg-emerald-600/20 transition-colors text-sm">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </button>
                    <button 
                      onClick={() => setIsEditingDetails(true)}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                      title="Edit Customer"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={saveCustomerDetails}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                )}
                <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white ml-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar">
              
              {/* Contact Info Section */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" /> Contact Information
                  </h4>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Phone Number</div>
                      {isEditingDetails ? (
                        <input type="text" value={detailsForm.phone} onChange={e => setDetailsForm({...detailsForm, phone: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm" />
                      ) : (
                        <div className="font-medium text-zinc-200">{selectedCustomer.phone}</div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Email Address</div>
                      {isEditingDetails ? (
                        <input type="email" value={detailsForm.email} onChange={e => setDetailsForm({...detailsForm, email: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm" />
                      ) : (
                        <div className="font-medium text-zinc-200">{selectedCustomer.email || "No email provided"}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Delivery Address
                  </h4>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4">
                    {isEditingDetails ? (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">District</div>
                            <input type="text" value={detailsForm.district} onChange={e => setDetailsForm({...detailsForm, district: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm" />
                          </div>
                          <div>
                            <div className="text-xs text-zinc-500 mb-1">Thana</div>
                            <input type="text" value={detailsForm.thana} onChange={e => setDetailsForm({...detailsForm, thana: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm" />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500 mb-1">Full Address</div>
                          <textarea value={detailsForm.address} onChange={e => setDetailsForm({...detailsForm, address: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm h-20 resize-none" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium text-zinc-200">{selectedCustomer.district && selectedCustomer.thana ? `${selectedCustomer.district}, ${selectedCustomer.thana}` : "No District/Thana"}</div>
                        <div className="text-sm text-zinc-400">{selectedCustomer.address || "No detailed address provided"}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Info Section */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" /> Order Details
                  </h4>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-4">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Package className="h-3 w-3"/> Product Name</div>
                      {isEditingDetails ? (
                        <input type="text" value={detailsForm.product} onChange={e => setDetailsForm({...detailsForm, product: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm" />
                      ) : (
                        <div className="font-medium text-zinc-200">{selectedCustomer.product || "No product specified"}</div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                        <div className="text-xs text-zinc-500 mb-1">Total Amount</div>
                        {isEditingDetails ? (
                          <input type="number" value={detailsForm.totalSpent} onChange={e => setDetailsForm({...detailsForm, totalSpent: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-sm text-blue-400" />
                        ) : (
                          <div className="font-bold text-lg text-blue-400">৳ {selectedCustomer.totalSpent || 0}</div>
                        )}
                      </div>
                      <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                        <div className="text-xs text-zinc-500 mb-1">Delivery Charge</div>
                        {isEditingDetails ? (
                          <input type="number" value={detailsForm.deliveryCharge} onChange={e => setDetailsForm({...detailsForm, deliveryCharge: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 focus:outline-none focus:border-blue-500 text-sm" />
                        ) : (
                          <div className="font-bold text-lg text-zinc-300">৳ {selectedCustomer.deliveryCharge || 0}</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1"><Calendar className="h-3 w-3"/> Order Date</div>
                      {isEditingDetails ? (
                        <input type="text" value={detailsForm.date} onChange={e => setDetailsForm({...detailsForm, date: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm" />
                      ) : (
                        <div className="font-medium text-zinc-200">{selectedCustomer.date || "Unknown Date"}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Global CSS required for scrollbars within components */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #3f3f46;
          border-radius: 10px;
        }
      `}} />
    </div>
  )
}
