"use client"

import { useState } from "react"
import { Search, Download, Upload, Filter, MoreHorizontal, X, FileSpreadsheet, CheckCircle2, Edit2, Save } from "lucide-react"
import Papa from "papaparse"

// Extended mock data based on user requirements
const initialCustomers = [
  { id: 1, name: "Rakib Raja", phone: "01819XXXXXX", email: "rakib@example.com", district: "Dhaka", thana: "Mirpur", address: "Mirpur 10", product: "AI Course", orderId: "ORD-101", deliveryCharge: 60, totalOrders: 5, totalSpent: 12500, status: "Delivered 🟢" },
  { id: 2, name: "Tanvir Ahmed", phone: "01712XXXXXX", email: "tanvir@example.com", district: "Chattogram", thana: "Panchlaish", address: "O.R. Nizam Road", product: "Web Dev Course", orderId: "ORD-102", deliveryCharge: 100, totalOrders: 1, totalSpent: 1200, status: "Pending 🟡" },
  { id: 3, name: "Sajid Hasan", phone: "01614XXXXXX", email: "", district: "Sylhet", thana: "Zindabazar", address: "Zindabazar Road", product: "SEO Mastery", orderId: "ORD-103", deliveryCharge: 120, totalOrders: 2, totalSpent: 3400, status: "Returned 🟣" },
  { id: 4, name: "Mehedi", phone: "01915XXXXXX", email: "", district: "", thana: "", address: "", product: "", orderId: "", deliveryCharge: 0, totalOrders: 0, totalSpent: 0, status: "Raw Leads 📱" },
]

const TABS = ['All', 'Pending 🟡', 'Confirmed 🔵', 'Delivered 🟢', 'Returned 🟣', 'Hold 🟠', 'Cancelled 🔴', 'Raw Leads 📱']

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  
  // CSV Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [uploadTargetSegment, setUploadTargetSegment] = useState('')

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<any>({})

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setParsedData(results.data)
        }
      })
    }
  }

  const handleProcessCsv = () => {
    if (!uploadTargetSegment) {
      alert("দয়া করে একটি স্ট্যাটাস সেগমেন্ট সিলেক্ট করুন!")
      return
    }
    
    // Convert parsed CSV to our customer format
    const newCustomers = parsedData.filter(row => Object.keys(row).length > 1).map((row, index) => ({
      id: Date.now() + index,
      name: row['Name'] || row['Customer Name'] || "Unknown",
      phone: row['Phone'] || row['Mobile'] || "No Phone",
      email: row['Email'] || "",
      district: row['District'] || row['Zila'] || "",
      thana: row['Thana'] || row['Upazila'] || "",
      address: row['Address'] || "",
      product: row['Product'] || row['Item'] || "",
      orderId: row['Order ID'] || row['Invoice'] || `NEW-${Date.now().toString().slice(-4)}`,
      deliveryCharge: Number(row['Delivery Charge'] || row['Shipping']) || 0,
      totalOrders: 1,
      totalSpent: Number(row['Price'] || row['Total']) || 0,
      status: uploadTargetSegment
    }))

    setCustomers(prev => [...newCustomers, ...prev])
    setIsUploadModalOpen(false)
    setSelectedFile(null)
    setParsedData([])
    setUploadTargetSegment('')
    alert(`${newCustomers.length} জন কাস্টমার সফলভাবে '${uploadTargetSegment}' ট্যাবে আপলোড হয়েছে!`)
  }

  const handleEditClick = (customer: any) => {
    setEditingId(customer.id)
    setEditForm(customer)
  }

  const handleSaveEdit = () => {
    setCustomers(prev => prev.map(c => c.id === editingId ? editForm : c))
    setEditingId(null)
  }

  // Filter customers based on active tab and search query
  const filteredCustomers = customers.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery) || 
                          c.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

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
            Import CSV
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
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
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-300">
              <Filter className="h-4 w-4" />
              Filter Custom Columns
            </button>
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
                <th className="px-6 py-4 font-medium">Customer Info</th>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Address</th>
                <th className="px-6 py-4 font-medium">Delivery</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                    No records found in "{activeTab}" segment.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-zinc-900/50 transition-colors group whitespace-nowrap">
                    {/* CUSTOMER INFO */}
                    <td className="px-6 py-4">
                      {editingId === customer.id ? (
                        <div className="space-y-2">
                          <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded border border-zinc-700 w-full" placeholder="Name" />
                          <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded border border-zinc-700 w-full" placeholder="Phone" />
                        </div>
                      ) : (
                        <>
                          <div className="font-medium text-zinc-100">{customer.name || "Unknown"}</div>
                          <div className="text-zinc-500 text-xs">{customer.phone}</div>
                          {customer.email && <div className="text-zinc-500 text-xs">{customer.email}</div>}
                        </>
                      )}
                    </td>

                    {/* ORDER ID */}
                    <td className="px-6 py-4 font-medium text-zinc-300">{customer.orderId || "-"}</td>

                    {/* PRODUCT */}
                    <td className="px-6 py-4 text-zinc-400">
                      {editingId === customer.id ? (
                        <input type="text" value={editForm.product} onChange={e => setEditForm({...editForm, product: e.target.value})} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded border border-zinc-700 w-full" placeholder="Product" />
                      ) : (
                        customer.product || "-"
                      )}
                    </td>

                    {/* ADDRESS */}
                    <td className="px-6 py-4">
                      {editingId === customer.id ? (
                        <div className="space-y-2">
                          <input type="text" value={editForm.district} onChange={e => setEditForm({...editForm, district: e.target.value})} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded border border-zinc-700 w-full" placeholder="District" />
                          <input type="text" value={editForm.thana} onChange={e => setEditForm({...editForm, thana: e.target.value})} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded border border-zinc-700 w-full" placeholder="Thana" />
                        </div>
                      ) : (
                        customer.district ? (
                          <>
                            <div className="text-zinc-200">{customer.district}, {customer.thana}</div>
                            <div className="text-zinc-500 text-xs truncate max-w-[150px]">{customer.address}</div>
                          </>
                        ) : (
                          <span className="text-zinc-600">-</span>
                        )
                      )}
                    </td>

                    {/* DELIVERY CHARGE */}
                    <td className="px-6 py-4 text-zinc-400">
                      {editingId === customer.id ? (
                        <input type="number" value={editForm.deliveryCharge} onChange={e => setEditForm({...editForm, deliveryCharge: Number(e.target.value)})} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded border border-zinc-700 w-16" />
                      ) : (
                        customer.deliveryCharge ? `৳ ${customer.deliveryCharge}` : "-"
                      )}
                    </td>

                    {/* TOTAL SPENT */}
                    <td className="px-6 py-4 font-medium text-blue-400">
                      {editingId === customer.id ? (
                        <input type="number" value={editForm.totalSpent} onChange={e => setEditForm({...editForm, totalSpent: Number(e.target.value)})} className="bg-zinc-800 text-white text-xs px-2 py-1 rounded border border-zinc-700 w-20" />
                      ) : (
                        customer.totalSpent ? `৳ ${customer.totalSpent.toLocaleString()}` : "-"
                      )}
                    </td>

                    {/* STATUS */}
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

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      {editingId === customer.id ? (
                        <button onClick={handleSaveEdit} className="p-2 bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/30 rounded-lg transition-colors">
                          <Save className="h-4 w-4" />
                        </button>
                      ) : (
                        <button onClick={() => handleEditClick(customer)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
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

      {/* Upload CSV Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Import Custom Data (CSV)</h3>
                <p className="text-sm text-zinc-400 mt-1">Upload records directly into a specific segment.</p>
              </div>
              <button 
                onClick={() => { setIsUploadModalOpen(false); setSelectedFile(null); setParsedData([]); }}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Target Segment Selector */}
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

              {/* Drag & Drop Area */}
              <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-900 transition-colors cursor-pointer group relative bg-zinc-950">
                <input 
                  type="file" 
                  accept=".csv, .xlsx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
                
                {selectedFile ? (
                  <>
                    <div className="p-4 bg-emerald-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h4 className="font-semibold mb-1 text-emerald-400">{selectedFile.name}</h4>
                    <p className="text-sm text-zinc-400">{parsedData.length > 0 ? `${parsedData.length} rows found` : 'Processing file...'}</p>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-zinc-800 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <FileSpreadsheet className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h4 className="font-semibold mb-1 text-zinc-200">Click or drag CSV file to upload</h4>
                    <p className="text-sm text-zinc-500">Supported format: .csv</p>
                  </>
                )}
              </div>
              
              {/* Smart Automation Toggle */}
              <div className="flex items-center gap-3 p-4 bg-blue-900/10 rounded-xl border border-blue-900/30">
                <input type="checkbox" id="auto-parse" className="rounded bg-zinc-900 border-zinc-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-950 h-4 w-4" defaultChecked />
                <label htmlFor="auto-parse" className="text-sm">
                  <span className="font-medium block text-blue-400">Auto-parse Address (AI)</span>
                  <span className="text-zinc-500 text-xs">Automatically extract District & Thana from address column.</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-3">
              <button 
                onClick={() => { setIsUploadModalOpen(false); setSelectedFile(null); setParsedData([]); }}
                className="px-4 py-2 border border-zinc-700 hover:bg-zinc-800 rounded-lg font-medium transition-colors text-zinc-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleProcessCsv}
                disabled={!selectedFile || parsedData.length === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !selectedFile || parsedData.length === 0 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Upload & Process
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
