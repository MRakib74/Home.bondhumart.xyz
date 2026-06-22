"use client";

import React, { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Settings, LayoutTemplate } from "lucide-react";

// Sortable Item Component
function SortableBlock({ id, type, title, onRemove }: { id: string, type: string, title: string, onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-lg group">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-zinc-500 hover:text-white transition">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium flex items-center gap-2">
            {title}
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">{type}</span>
          </h3>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-zinc-400 hover:text-blue-400 p-1"><Settings className="w-4 h-4" /></button>
            <button onClick={() => onRemove(id)} className="text-zinc-400 hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-1">Configure this block's settings by clicking the gear icon.</p>
      </div>
    </div>
  );
}

export default function LandingPageBuilder() {
  const [blocks, setBlocks] = useState([
    { id: '1', type: 'Hero', title: 'Main Hero Banner' },
    { id: '2', type: 'Benefits', title: 'Why Choose Us' },
  ]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const blockTypes = [
    { type: 'Hero', label: 'Hero', icon: '✨' },
    { type: 'Text content', label: 'Text content', icon: '📄' },
    { type: 'Benefits', label: 'Benefits', icon: '✅' },
    { type: 'Video', label: 'Video', icon: '🎥' },
    { type: 'Cta button', label: 'Cta button', icon: '🖱️' },
    { type: 'Reviews', label: 'Reviews', icon: '⭐' },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addBlock = (type: string, label: string) => {
    setBlocks([...blocks, { id: Math.random().toString(), type, title: `New ${label}` }]);
    setIsDropdownOpen(false);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <LayoutTemplate className="w-6 h-6 text-primary" />
          Create Landing Page
        </h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm hover:bg-zinc-700 transition">Cancel</button>
          <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm hover:bg-zinc-700 transition">Create & create another</button>
          <button className="px-6 py-2 bg-primary text-black font-semibold rounded-lg text-sm hover:bg-primary/90 transition">Create</button>
        </div>
      </div>

      {/* Basic Settings */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Basic Settings</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Select Product for this Landing Page *</label>
              <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white appearance-none">
                <option>Select an option</option>
                <option>Wireless Headphones</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Slug *</label>
              <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="my-landing-page" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Page Background Color</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" defaultValue="#F5F3FF" />
                <div className="w-10 h-10 rounded-lg border border-zinc-800 bg-[#F5F3FF]"></div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Outside Dhaka Delivery Charge (৳) *</label>
              <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" defaultValue={120} />
            </div>
            
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-lg">
                <span className="text-sm text-zinc-300">Require 11-Digit Phone Number</span>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
              <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-lg">
                <span className="text-sm text-zinc-300">Publish Page</span>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Title *</label>
              <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" placeholder="Landing Page Title" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Theme Color (Primary)</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" defaultValue="#319b03" />
                <div className="w-10 h-10 rounded-lg border border-zinc-800 bg-[#319b03]"></div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Inside Dhaka Delivery Charge (৳) *</label>
              <input type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" defaultValue={60} />
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="freeDel" className="w-5 h-5 accent-primary rounded" />
              <label htmlFor="freeDel" className="text-sm text-zinc-300">Free Delivery on this Page</label>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content Builder */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Page Content (Builder)</h2>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm hover:bg-zinc-800 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add to design your Landing Page
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-10 overflow-hidden">
                {blockTypes.map(bt => (
                  <button 
                    key={bt.type}
                    onClick={() => addBlock(bt.type, bt.label)}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition flex items-center gap-2"
                  >
                    <span>{bt.icon}</span> {bt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-zinc-500 text-sm mb-4">Design your Landing Page by dragging and dropping blocks below.</p>

        {blocks.length > 0 ? (
          <div className="bg-black/50 p-4 rounded-xl border border-zinc-800/50 min-h-[200px]">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {blocks.map(block => (
                    <SortableBlock 
                      key={block.id} 
                      id={block.id} 
                      type={block.type} 
                      title={block.title} 
                      onRemove={removeBlock} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        ) : (
          <div className="border-2 border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
            No blocks added yet. Click the "Add" button to start designing.
          </div>
        )}
      </div>
      
    </div>
  );
}
