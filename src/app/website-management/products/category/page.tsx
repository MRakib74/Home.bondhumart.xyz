"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash, FolderTree } from "lucide-react";

export default function CategoryManagePage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", slug: "electronics", parent: null },
    { id: 2, name: "Smartphones", slug: "smartphones", parent: "Electronics" },
    { id: 3, name: "Clothing", slug: "clothing", parent: null },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-primary" />
            Category Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Manage main and sub-categories for your products</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Category Name</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Parent Category</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-zinc-900/50 transition">
                <td className="px-6 py-4 font-medium text-white">{cat.name}</td>
                <td className="px-6 py-4 text-zinc-500">{cat.slug}</td>
                <td className="px-6 py-4">
                  {cat.parent ? (
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded text-xs">{cat.parent}</span>
                  ) : (
                    <span className="text-zinc-600 italic">None (Main)</span>
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
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  No categories found. Click "Add Category" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal (Static UI for now) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add New Category</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Category Name</label>
                <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" placeholder="e.g. Fashion" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Slug</label>
                <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary" placeholder="e.g. fashion" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Parent Category</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary appearance-none">
                  <option value="">None (Main Category)</option>
                  <option value="1">Electronics</option>
                  <option value="3">Clothing</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:bg-primary/90 transition">
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
