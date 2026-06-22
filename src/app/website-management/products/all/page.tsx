"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash, Package, Search } from "lucide-react";

export default function ProductManagePage() {
  const [products] = useState([
    { id: 1, name: "Wireless Headphones", price: 2500, stock: 50, category: "Electronics" },
    { id: 2, name: "Smart Watch T500", price: 1200, stock: 120, category: "Electronics" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Basics");

  const tabs = ["Basics", "Bundle Offers", "Media", "AI Salesman", "Page Content (Builder)", "Extra Settings & Reviews"];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Product Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Manage products, bundles, media and AI salesman settings</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Product Name</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map((prod) => (
              <tr key={prod.id} className="hover:bg-zinc-900/50 transition">
                <td className="px-6 py-4 font-medium text-white">{prod.name}</td>
                <td className="px-6 py-4 text-zinc-500">{prod.category}</td>
                <td className="px-6 py-4 text-primary font-bold">৳{prod.price}</td>
                <td className="px-6 py-4">
                  <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">{prod.stock} in stock</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 bg-zinc-800 hover:bg-blue-500/20 hover:text-blue-400 rounded-md transition text-zinc-400">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 rounded-md transition text-zinc-400">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal (Large Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold text-white">Create New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition">
                ✕
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-zinc-800 shrink-0 custom-scrollbar">
              {tabs.map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar text-zinc-300 text-sm">
              {activeTab === "Basics" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-400 mb-1">Product Name</label>
                    <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="Enter product name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1">Price (৳)</label>
                      <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Stock</label>
                      <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Category</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white appearance-none">
                      <option>Select a category</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Description</label>
                    <textarea rows={4} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="Product description..."></textarea>
                  </div>
                </div>
              )}
              {activeTab === "Bundle Offers" && <p>Bundle offers configuration will go here.</p>}
              {activeTab === "Media" && <p>Image/Video upload zone will go here.</p>}
              {activeTab === "AI Salesman" && <p>AI Salesman prompt and training data for this specific product will go here.</p>}
              {activeTab === "Page Content (Builder)" && <p>Visual grid builder to design the product page goes here.</p>}
              {activeTab === "Extra Settings & Reviews" && <p>SEO, meta tags, and specific reviews setup goes here.</p>}
            </div>

            <div className="p-4 border-t border-zinc-800 flex justify-end gap-3 shrink-0 bg-[#0a0a0a]">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition">Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/90 transition">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
