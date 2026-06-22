"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  FileText,
  PanelTop,
  PanelBottom,
  ShoppingCart,
  Heart,
  ChevronRight,
  Save,
  Eye,
  ImageIcon,
  Type,
  Columns,
  List,
  Megaphone,
  Edit,
} from "lucide-react";

// Page types for the builder
const pageTypes = [
  { 
    id: "header", 
    name: "Header & Marquee", 
    icon: PanelTop, 
    description: "Top navigation bar, logo, and scrolling marquee announcement text",
    color: "from-blue-500/20 to-blue-600/10 border-blue-500/30"
  },
  { 
    id: "frontpage", 
    name: "Front Page", 
    icon: LayoutGrid, 
    description: "Homepage hero, featured products, banners and category sections",
    color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30"
  },
  { 
    id: "checkout", 
    name: "Checkout Page", 
    icon: ShoppingCart, 
    description: "Order form layout, delivery options, and payment sections",
    color: "from-amber-500/20 to-amber-600/10 border-amber-500/30"
  },
  { 
    id: "thankyou", 
    name: "Thank You Page", 
    icon: Heart, 
    description: "Post-order confirmation page with order summary and upsells",
    color: "from-pink-500/20 to-pink-600/10 border-pink-500/30"
  },
  { 
    id: "footer", 
    name: "Footer & Socials", 
    icon: PanelBottom, 
    description: "Footer links, social media icons, contact information",
    color: "from-purple-500/20 to-purple-600/10 border-purple-500/30"
  },
  { 
    id: "custom", 
    name: "Custom Pages Content", 
    icon: FileText, 
    description: "About Us, Return Policy, Terms & Conditions, Privacy Policy",
    color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30"
  },
];

// Custom pages under "Custom Pages Content"
const customPages = [
  { id: "about", name: "About Us", icon: "📋" },
  { id: "return", name: "Return Policy", icon: "🔄" },
  { id: "terms", name: "Terms & Conditions", icon: "📜" },
  { id: "privacy", name: "Privacy Policy", icon: "🔒" },
];

interface ContentBlock {
  id: string;
  type: "text" | "image_text" | "heading" | "image_grid" | "banner" | "spacer";
  data: Record<string, any>;
}

function ContentBlockEditor({ block, onChange, onDelete }: { block: ContentBlock; onChange: (data: Record<string, any>) => void; onDelete: () => void }) {
  const d = block.data;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 group relative">
      <button onClick={onDelete} className="absolute top-2 right-2 text-zinc-600 hover:text-red-400 transition text-xs opacity-0 group-hover:opacity-100">✕</button>
      
      {block.type === "heading" && (
        <div>
          <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Heading</label>
          <input value={d.text || ""} onChange={(e) => onChange({ ...d, text: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-lg font-bold" placeholder="Section Heading" />
        </div>
      )}

      {block.type === "text" && (
        <div>
          <label className="block text-[10px] uppercase text-zinc-500 mb-1 font-bold">Text Paragraph</label>
          <textarea value={d.content || ""} onChange={(e) => onChange({ ...d, content: e.target.value })} rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="Write your content here..." />
        </div>
      )}

      {block.type === "image_text" && (
        <div className="space-y-3">
          <label className="block text-[10px] uppercase text-zinc-500 font-bold">Image + Text Block (Grid Layout)</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Image URL (Left Side)</label>
              <input value={d.imageUrl || ""} onChange={(e) => onChange({ ...d, imageUrl: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="https://..." />
              <div className="mt-2">
                <label className="block text-xs text-zinc-400 mb-1">Image Shape</label>
                <select value={d.imageShape || "rounded"} onChange={(e) => onChange({ ...d, imageShape: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm appearance-none">
                  <option value="rounded">Rounded Rectangle</option>
                  <option value="circle">Circle / Round</option>
                  <option value="square">Square</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Text Content (Right Side)</label>
              <textarea value={d.content || ""} onChange={(e) => onChange({ ...d, content: e.target.value })} rows={5} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="Description text..." />
            </div>
          </div>
        </div>
      )}

      {block.type === "image_grid" && (
        <div className="space-y-3">
          <label className="block text-[10px] uppercase text-zinc-500 font-bold">Image Grid</label>
          <div className="grid grid-cols-2 gap-2">
            {(d.images || ["", ""]).map((img: string, i: number) => (
              <input key={i} value={img} onChange={(e) => { const images = [...(d.images || ["", ""])]; images[i] = e.target.value; onChange({ ...d, images }); }} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm" placeholder={`Image ${i + 1} URL`} />
            ))}
          </div>
          <button onClick={() => onChange({ ...d, images: [...(d.images || []), ""] })} className="text-xs text-primary hover:underline">+ Add Image</button>
        </div>
      )}

      {block.type === "banner" && (
        <div className="space-y-3">
          <label className="block text-[10px] uppercase text-zinc-500 font-bold">Banner</label>
          <input value={d.imageUrl || ""} onChange={(e) => onChange({ ...d, imageUrl: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="Banner image URL" />
          <input value={d.link || ""} onChange={(e) => onChange({ ...d, link: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="Click link (optional)" />
        </div>
      )}

      {block.type === "spacer" && (
        <div className="py-2 text-center text-zinc-600 text-xs">— Spacer ({d.height || 40}px) —</div>
      )}
    </div>
  );
}

export default function PageBuilderPage() {
  const [selectedPageType, setSelectedPageType] = useState<string | null>(null);
  const [selectedCustomPage, setSelectedCustomPage] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const addBlock = (type: ContentBlock["type"]) => {
    const defaults: Record<string, any> = {
      heading: { text: "" },
      text: { content: "" },
      image_text: { imageUrl: "", imageShape: "circle", content: "" },
      image_grid: { images: ["", ""] },
      banner: { imageUrl: "", link: "" },
      spacer: { height: 40 },
    };
    setBlocks([...blocks, { id: `b-${Date.now()}`, type, data: defaults[type] || {} }]);
  };

  const updateBlock = (id: string, data: Record<string, any>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, data } : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  // Grid view: show all page types
  if (!selectedPageType) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            Page Design & Builder
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Design and customize every page of your website dynamically</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageTypes.map((page) => (
            <button
              key={page.id}
              onClick={() => {
                setSelectedPageType(page.id);
                if (page.id === "custom") setSelectedCustomPage(null);
              }}
              className={`bg-gradient-to-br ${page.color} border rounded-2xl p-6 text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-zinc-900/50 text-primary">
                  <page.icon className="h-6 w-6" />
                </div>
                <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-white font-bold text-base mb-1">{page.name}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">{page.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Custom pages sub-selection
  if (selectedPageType === "custom" && !selectedCustomPage) {
    return (
      <div className="p-6">
        <button onClick={() => setSelectedPageType(null)} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition text-sm">
          ← Back to All Pages
        </button>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Custom Pages Content
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Design and write content for your custom pages</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customPages.map((cp) => (
            <button
              key={cp.id}
              onClick={() => { setSelectedCustomPage(cp.id); setBlocks([]); }}
              className="bg-[#0a0a0a] border border-zinc-800 hover:border-cyan-500/30 rounded-xl p-6 text-left group transition-all hover:bg-gradient-to-br hover:from-cyan-500/5 hover:to-transparent"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{cp.icon}</span>
                <h3 className="text-white font-bold">{cp.name}</h3>
              </div>
              <p className="text-zinc-500 text-xs">Click to design and write content for this page</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Editor view
  const currentPageInfo = selectedPageType === "custom" 
    ? customPages.find(cp => cp.id === selectedCustomPage) 
    : pageTypes.find(p => p.id === selectedPageType);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => { 
            if (selectedPageType === "custom" && selectedCustomPage) setSelectedCustomPage(null);
            else setSelectedPageType(null); 
          }} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-2 transition text-sm">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Edit className="h-6 w-6 text-primary" />
            Editing: {selectedPageType === "custom" ? currentPageInfo?.name : (currentPageInfo as any)?.name}
          </h1>
        </div>
        <button className="bg-primary text-black font-semibold px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition">
          <Save className="h-4 w-4" /> Save Design
        </button>
      </div>

      {/* Block toolbar */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 mb-6">
        <p className="text-xs text-zinc-500 mb-3 font-bold uppercase">Add Content Block</p>
        <div className="flex flex-wrap gap-2">
          {[
            { type: "heading" as const, label: "Heading", icon: <Type className="h-3.5 w-3.5" /> },
            { type: "text" as const, label: "Text", icon: <FileText className="h-3.5 w-3.5" /> },
            { type: "image_text" as const, label: "Image + Text (Grid)", icon: <Columns className="h-3.5 w-3.5" /> },
            { type: "image_grid" as const, label: "Image Grid", icon: <ImageIcon className="h-3.5 w-3.5" /> },
            { type: "banner" as const, label: "Banner", icon: <Megaphone className="h-3.5 w-3.5" /> },
            { type: "spacer" as const, label: "Spacer", icon: <List className="h-3.5 w-3.5" /> },
          ].map((btn) => (
            <button
              key={btn.type}
              onClick={() => addBlock(btn.type)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-primary/50 rounded-lg text-zinc-300 hover:text-primary text-xs font-medium transition"
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="border-2 border-dashed border-zinc-800 rounded-xl p-12 text-center">
            <LayoutGrid className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-1">Start Designing</h3>
            <p className="text-zinc-500 text-sm">Add content blocks from the toolbar above to build this page.</p>
          </div>
        ) : (
          blocks.map((block) => (
            <ContentBlockEditor
              key={block.id}
              block={block}
              onChange={(data) => updateBlock(block.id, data)}
              onDelete={() => deleteBlock(block.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
