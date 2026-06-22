"use client";

import React, { useState } from "react";
import { Tags, Plus, Trash, Edit } from "lucide-react";

export default function CouponManagePage() {
  const [coupons] = useState([
    { id: 1, code: "BONDHU50", discount: "৳50", type: "Fixed", appliesTo: "All Products", showOnLanding: true, active: true },
    { id: 2, code: "SUMMER10", discount: "10%", type: "Percentage", appliesTo: "Specific Products", showOnLanding: false, active: true },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tags className="h-6 w-6 text-primary" />
            Coupon Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Create and manage discount codes for checkout and landing pages</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Coupon Code</th>
              <th className="px-6 py-4 font-medium">Discount</th>
              <th className="px-6 py-4 font-medium">Applies To</th>
              <th className="px-6 py-4 font-medium">Landing Page</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-zinc-900/50 transition">
                <td className="px-6 py-4 font-bold text-white tracking-wider">{coupon.code}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold">{coupon.discount}</td>
                <td className="px-6 py-4 text-zinc-400">{coupon.appliesTo}</td>
                <td className="px-6 py-4">
                  {coupon.showOnLanding ? (
                    <span className="text-emerald-500 text-xs bg-emerald-500/10 px-2 py-1 rounded">Visible</span>
                  ) : (
                    <span className="text-zinc-500 text-xs bg-zinc-800 px-2 py-1 rounded">Hidden</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {coupon.active ? (
                    <span className="text-primary text-xs bg-primary/10 px-2 py-1 rounded">Active</span>
                  ) : (
                    <span className="text-red-500 text-xs bg-red-500/10 px-2 py-1 rounded">Inactive</span>
                  )}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Create New Coupon</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Coupon Code</label>
                <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white font-mono uppercase" placeholder="e.g. FLASH50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Discount Type</label>
                  <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white appearance-none">
                    <option>Fixed Amount (৳)</option>
                    <option>Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Value</label>
                  <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Applies To</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white appearance-none">
                  <option>All Products</option>
                  <option>Specific Product (Select below)</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="landing" className="w-4 h-4 accent-primary" defaultChecked />
                <label htmlFor="landing" className="text-sm text-zinc-300">Show visually on Landing Pages</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition">Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/90 transition">Create Coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
