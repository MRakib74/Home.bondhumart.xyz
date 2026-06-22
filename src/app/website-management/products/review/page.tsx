"use client";

import React, { useState } from "react";
import { Star, CheckCircle, XCircle, Plus, Trash } from "lucide-react";

export default function ReviewManagePage() {
  const [reviews] = useState([
    { id: 1, product: "Wireless Headphones", customer: "Rahim Islam", rating: 5, comment: "Excellent product, very fast delivery!", status: "Pending", source: "Customer" },
    { id: 2, product: "Smart Watch T500", customer: "Karim", rating: 4, comment: "Good quality for the price.", status: "Approved", source: "Admin" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            Review Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Approve customer reviews or add your own reviews manually</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Add Review Manually
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Rating & Comment</th>
              <th className="px-6 py-4 font-medium">Status / Source</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {reviews.map((rev) => (
              <tr key={rev.id} className="hover:bg-zinc-900/50 transition">
                <td className="px-6 py-4 font-medium text-white">{rev.customer}</td>
                <td className="px-6 py-4 text-zinc-400">{rev.product}</td>
                <td className="px-6 py-4">
                  <div className="flex text-yellow-500 mb-1">
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                  </div>
                  <p className="text-xs text-zinc-500 max-w-xs truncate">{rev.comment}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 items-start">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rev.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {rev.status}
                    </span>
                    <span className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">Via {rev.source}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {rev.status === 'Pending' && (
                      <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-md transition text-emerald-500" title="Approve">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button className="p-2 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 rounded-md transition text-zinc-400" title="Delete">
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
            <h2 className="text-xl font-bold text-white mb-4">Add Manual Review</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Product</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white appearance-none">
                  <option>Select a product</option>
                  <option>Wireless Headphones</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Customer Name</label>
                  <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="5" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Review Text</label>
                <textarea rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="Write the review here..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Photo (Optional)</label>
                <input type="file" className="text-zinc-500 text-sm w-full" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition">Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/90 transition">Save & Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
