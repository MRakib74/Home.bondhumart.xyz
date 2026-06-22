"use client";

import React, { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PanelTop,
  Plus,
  Trash,
  GripVertical,
  Eye,
  Save,
  ArrowLeft,
  ImageIcon,
  Type,
  CheckCircle,
  PlayCircle,
  MousePointerClick,
  Star,
  Settings,
  ChevronDown,
  Edit,
  Copy,
  ExternalLink,
} from "lucide-react";

// ---- Block Type Definitions ----
type BlockType = "hero" | "text" | "benefits" | "video" | "cta" | "reviews" | "image_gallery" | "countdown" | "faq";

interface Block {
  id: string;
  type: BlockType;
  data: Record<string, any>;
}

interface LandingPageData {
  id?: string;
  title: string;
  slug: string;
  productId: string;
  themeColor: string;
  bgColor: string;
  deliveryInside: number;
  deliveryOutside: number;
  freeDelivery: boolean;
  requirePhone: boolean;
  isPublished: boolean;
  blocks: Block[];
}

const blockTypes: { type: BlockType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: "hero", label: "Hero", icon: <ImageIcon className="h-4 w-4" />, description: "Main banner with headline and image" },
  { type: "text", label: "Text Content", icon: <Type className="h-4 w-4" />, description: "Rich text paragraph section" },
  { type: "benefits", label: "Benefits", icon: <CheckCircle className="h-4 w-4" />, description: "Feature list with icons" },
  { type: "video", label: "Video", icon: <PlayCircle className="h-4 w-4" />, description: "YouTube or uploaded video embed" },
  { type: "cta", label: "CTA Button", icon: <MousePointerClick className="h-4 w-4" />, description: "Call-to-action button" },
  { type: "reviews", label: "Reviews", icon: <Star className="h-4 w-4" />, description: "Customer review cards" },
  { type: "image_gallery", label: "Image Gallery", icon: <ImageIcon className="h-4 w-4" />, description: "Grid of product images" },
  { type: "faq", label: "FAQ", icon: <Type className="h-4 w-4" />, description: "Frequently asked questions" },
];

function getDefaultData(type: BlockType): Record<string, any> {
  switch (type) {
    case "hero": return { headline: "", subheadline: "", imageUrl: "", buttonText: "Order Now" };
    case "text": return { content: "" };
    case "benefits": return { items: [{ icon: "✅", text: "" }] };
    case "video": return { url: "", autoplay: false };
    case "cta": return { text: "অর্ডার করুন", style: "primary" };
    case "reviews": return { items: [{ name: "", rating: 5, comment: "", image: "" }] };
    case "image_gallery": return { images: [] };
    case "faq": return { items: [{ question: "", answer: "" }] };
    default: return {};
  }
}

// ---- Sortable Block Component ----
function SortableBlock({
  block,
  onDelete,
  onEdit,
  isEditing,
}: {
  block: Block;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isEditing: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const blockMeta = blockTypes.find((b) => b.type === block.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-zinc-900/80 border rounded-xl p-4 flex items-center gap-4 transition-all duration-200 ${
        isDragging ? "border-primary shadow-lg shadow-primary/20 z-50" : isEditing ? "border-primary/50" : "border-zinc-800 hover:border-zinc-700"
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-300 transition p-1">
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">{blockMeta?.icon}</div>
        <div className="min-w-0">
          <p className="text-white font-medium text-sm">{blockMeta?.label}</p>
          <p className="text-zinc-500 text-xs truncate">{blockMeta?.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(block.id)} className="p-2 rounded-lg bg-zinc-800 hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400 transition" title="Edit">
          <Edit className="h-4 w-4" />
        </button>
        <button onClick={() => onDelete(block.id)} className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition" title="Delete">
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ---- Block Editor Panel ----
function BlockEditor({ block, onChange }: { block: Block; onChange: (data: Record<string, any>) => void }) {
  const d = block.data;

  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Headline</label>
            <input value={d.headline || ""} onChange={(e) => onChange({ ...d, headline: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" placeholder="Best Quality Product" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Sub-headline</label>
            <input value={d.subheadline || ""} onChange={(e) => onChange({ ...d, subheadline: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" placeholder="Order today and get free delivery!" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Image URL</label>
            <input value={d.imageUrl || ""} onChange={(e) => onChange({ ...d, imageUrl: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Button Text</label>
            <input value={d.buttonText || ""} onChange={(e) => onChange({ ...d, buttonText: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" placeholder="Order Now" />
          </div>
        </div>
      );
    case "text":
      return (
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Content</label>
          <textarea value={d.content || ""} onChange={(e) => onChange({ ...d, content: e.target.value })} rows={6} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" placeholder="Write your content here..." />
        </div>
      );
    case "benefits":
      return (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-zinc-400">Benefits List</label>
          {(d.items || []).map((item: any, i: number) => (
            <div key={i} className="flex gap-2">
              <input value={item.icon} onChange={(e) => { const items = [...d.items]; items[i] = { ...items[i], icon: e.target.value }; onChange({ ...d, items }); }} className="w-16 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-2 text-white text-sm text-center" placeholder="✅" />
              <input value={item.text} onChange={(e) => { const items = [...d.items]; items[i] = { ...items[i], text: e.target.value }; onChange({ ...d, items }); }} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" placeholder="Benefit text" />
              <button onClick={() => { const items = d.items.filter((_: any, idx: number) => idx !== i); onChange({ ...d, items }); }} className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"><Trash className="h-4 w-4" /></button>
            </div>
          ))}
          <button onClick={() => onChange({ ...d, items: [...(d.items || []), { icon: "✅", text: "" }] })} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add Benefit</button>
        </div>
      );
    case "video":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Video URL (YouTube / Direct)</label>
            <input value={d.url || ""} onChange={(e) => onChange({ ...d, url: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" placeholder="https://youtube.com/watch?v=..." />
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
            <input type="checkbox" checked={d.autoplay || false} onChange={(e) => onChange({ ...d, autoplay: e.target.checked })} className="w-4 h-4 accent-primary" />
            Autoplay
          </label>
        </div>
      );
    case "cta":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Button Text</label>
            <input value={d.text || ""} onChange={(e) => onChange({ ...d, text: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" placeholder="অর্ডার করুন" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Style</label>
            <select value={d.style || "primary"} onChange={(e) => onChange({ ...d, style: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm appearance-none">
              <option value="primary">Primary (Theme Color)</option>
              <option value="outline">Outline</option>
              <option value="gradient">Gradient</option>
            </select>
          </div>
        </div>
      );
    case "reviews":
      return (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-zinc-400">Review Cards</label>
          {(d.items || []).map((item: any, i: number) => (
            <div key={i} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 space-y-2">
              <div className="flex gap-2">
                <input value={item.name} onChange={(e) => { const items = [...d.items]; items[i] = { ...items[i], name: e.target.value }; onChange({ ...d, items }); }} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-white text-sm" placeholder="Customer name" />
                <input type="number" min={1} max={5} value={item.rating} onChange={(e) => { const items = [...d.items]; items[i] = { ...items[i], rating: parseInt(e.target.value) }; onChange({ ...d, items }); }} className="w-16 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-white text-sm text-center" />
                <button onClick={() => { const items = d.items.filter((_: any, idx: number) => idx !== i); onChange({ ...d, items }); }} className="p-1.5 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"><Trash className="h-3.5 w-3.5" /></button>
              </div>
              <textarea value={item.comment} onChange={(e) => { const items = [...d.items]; items[i] = { ...items[i], comment: e.target.value }; onChange({ ...d, items }); }} rows={2} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-white text-sm" placeholder="Review comment..." />
            </div>
          ))}
          <button onClick={() => onChange({ ...d, items: [...(d.items || []), { name: "", rating: 5, comment: "", image: "" }] })} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add Review</button>
        </div>
      );
    case "faq":
      return (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-zinc-400">FAQ Items</label>
          {(d.items || []).map((item: any, i: number) => (
            <div key={i} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 space-y-2">
              <div className="flex gap-2">
                <input value={item.question} onChange={(e) => { const items = [...d.items]; items[i] = { ...items[i], question: e.target.value }; onChange({ ...d, items }); }} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-white text-sm" placeholder="Question?" />
                <button onClick={() => { const items = d.items.filter((_: any, idx: number) => idx !== i); onChange({ ...d, items }); }} className="p-1.5 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"><Trash className="h-3.5 w-3.5" /></button>
              </div>
              <textarea value={item.answer} onChange={(e) => { const items = [...d.items]; items[i] = { ...items[i], answer: e.target.value }; onChange({ ...d, items }); }} rows={2} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-white text-sm" placeholder="Answer..." />
            </div>
          ))}
          <button onClick={() => onChange({ ...d, items: [...(d.items || []), { question: "", answer: "" }] })} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add FAQ</button>
        </div>
      );
    default:
      return <p className="text-zinc-500 text-sm">No editor available for this block type.</p>;
  }
}

// ---- Main Component ----
export default function LandingPageBuilderPage() {
  const [pages, setPages] = useState<LandingPageData[]>([]);
  const [currentPage, setCurrentPage] = useState<LandingPageData | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showBlockPicker, setShowBlockPicker] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Create a new blank landing page
  const createNewPage = () => {
    setCurrentPage({
      title: "",
      slug: "",
      productId: "",
      themeColor: "#319b03",
      bgColor: "#F5F3FF",
      deliveryInside: 60,
      deliveryOutside: 120,
      freeDelivery: false,
      requirePhone: true,
      isPublished: false,
      blocks: [],
    });
    setEditingBlockId(null);
  };

  // Add block
  const addBlock = (type: BlockType) => {
    if (!currentPage) return;
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      data: getDefaultData(type),
    };
    setCurrentPage({ ...currentPage, blocks: [...currentPage.blocks, newBlock] });
    setShowBlockPicker(false);
    setEditingBlockId(newBlock.id);
  };

  // Delete block
  const deleteBlock = (id: string) => {
    if (!currentPage) return;
    setCurrentPage({ ...currentPage, blocks: currentPage.blocks.filter((b) => b.id !== id) });
    if (editingBlockId === id) setEditingBlockId(null);
  };

  // Drag end
  const handleDragEnd = (event: DragEndEvent) => {
    if (!currentPage) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = currentPage.blocks.findIndex((b) => b.id === active.id);
      const newIndex = currentPage.blocks.findIndex((b) => b.id === over.id);
      setCurrentPage({ ...currentPage, blocks: arrayMove(currentPage.blocks, oldIndex, newIndex) });
    }
  };

  // Update block data
  const updateBlockData = (blockId: string, data: Record<string, any>) => {
    if (!currentPage) return;
    setCurrentPage({
      ...currentPage,
      blocks: currentPage.blocks.map((b) => (b.id === blockId ? { ...b, data } : b)),
    });
  };

  const editingBlock = currentPage?.blocks.find((b) => b.id === editingBlockId);

  // ---- LIST VIEW (No page selected) ----
  if (!currentPage) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <PanelTop className="h-6 w-6 text-primary" />
              Landing Page Builder
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Create dynamic, high-converting landing pages with drag-and-drop</p>
          </div>
          <button onClick={createNewPage} className="bg-primary text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition">
            <Plus className="h-4 w-4" /> Create Landing Page
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-12 text-center">
            <PanelTop className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Landing Pages Yet</h3>
            <p className="text-zinc-500 text-sm mb-6 max-w-md mx-auto">
              Create your first landing page to start selling products with high-converting pages. Use the drag-and-drop builder to design beautiful pages.
            </p>
            <button onClick={createNewPage} className="bg-primary text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition">
              Create Your First Page
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {pages.map((page, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-5 flex items-center justify-between hover:border-zinc-700 transition">
                <div>
                  <h3 className="text-white font-medium">{page.title || "Untitled"}</h3>
                  <p className="text-zinc-500 text-sm">/{page.slug || "..."}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${page.isPublished ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>
                    {page.isPublished ? "Published" : "Draft"}
                  </span>
                  <button onClick={() => { setCurrentPage(page); setEditingBlockId(null); }} className="p-2 bg-zinc-800 hover:bg-primary/20 hover:text-primary rounded-lg transition text-zinc-400">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---- BUILDER VIEW ----
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-[#0a0a0a] shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage(null)} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-white font-bold text-sm">
              {currentPage.title || "Untitled Landing Page"}
            </h2>
            <p className="text-zinc-500 text-xs">/{currentPage.slug || "..."}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-zinc-400 mr-3 cursor-pointer">
            <div className={`relative w-10 h-5 rounded-full transition ${currentPage.isPublished ? "bg-primary" : "bg-zinc-700"}`}>
              <input type="checkbox" checked={currentPage.isPublished} onChange={(e) => setCurrentPage({ ...currentPage, isPublished: e.target.checked })} className="sr-only" />
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${currentPage.isPublished ? "left-[22px]" : "left-0.5"}`}></div>
            </div>
            Publish
          </label>
          <button className="px-4 py-2 bg-primary text-black font-semibold rounded-lg flex items-center gap-2 hover:bg-primary/90 transition text-sm">
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Settings + Blocks */}
        <div className="w-[420px] border-r border-zinc-800 overflow-y-auto custom-scrollbar bg-[#060606]">
          {/* Basic Settings Accordion */}
          <details open className="border-b border-zinc-800">
            <summary className="px-5 py-4 text-sm font-bold text-white cursor-pointer flex items-center gap-2 hover:bg-zinc-900/50 transition select-none">
              <Settings className="h-4 w-4 text-primary" />
              Basic Settings
            </summary>
            <div className="px-5 pb-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Select Product for this Landing Page</label>
                <select value={currentPage.productId} onChange={(e) => setCurrentPage({ ...currentPage, productId: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm appearance-none">
                  <option value="">Select an option</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Title<span className="text-red-400">*</span></label>
                  <input value={currentPage.title} onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" placeholder="Product Title" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Slug<span className="text-red-400">*</span></label>
                  <input value={currentPage.slug} onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" placeholder="product-slug" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Theme Color (Primary)</label>
                  <div className="flex items-center gap-2">
                    <input value={currentPage.themeColor} onChange={(e) => setCurrentPage({ ...currentPage, themeColor: e.target.value })} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                    <input type="color" value={currentPage.themeColor} onChange={(e) => setCurrentPage({ ...currentPage, themeColor: e.target.value })} className="w-10 h-10 rounded-full border-2 border-zinc-700 cursor-pointer bg-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Page Background Color</label>
                  <div className="flex items-center gap-2">
                    <input value={currentPage.bgColor} onChange={(e) => setCurrentPage({ ...currentPage, bgColor: e.target.value })} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                    <input type="color" value={currentPage.bgColor} onChange={(e) => setCurrentPage({ ...currentPage, bgColor: e.target.value })} className="w-10 h-10 rounded-full border-2 border-zinc-700 cursor-pointer bg-transparent" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Inside Dhaka Delivery (৳)<span className="text-red-400">*</span></label>
                  <input type="number" value={currentPage.deliveryInside} onChange={(e) => setCurrentPage({ ...currentPage, deliveryInside: parseFloat(e.target.value) })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Outside Dhaka Delivery (৳)<span className="text-red-400">*</span></label>
                  <input type="number" value={currentPage.deliveryOutside} onChange={(e) => setCurrentPage({ ...currentPage, deliveryOutside: parseFloat(e.target.value) })} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm" />
                </div>
              </div>
              <div className="flex flex-col gap-3 pt-1">
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <div className={`relative w-10 h-5 rounded-full transition ${currentPage.freeDelivery ? "bg-primary" : "bg-zinc-700"}`}>
                    <input type="checkbox" checked={currentPage.freeDelivery} onChange={(e) => setCurrentPage({ ...currentPage, freeDelivery: e.target.checked })} className="sr-only" />
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${currentPage.freeDelivery ? "left-[22px]" : "left-0.5"}`}></div>
                  </div>
                  Free Delivery on this Page
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <div className={`relative w-10 h-5 rounded-full transition ${currentPage.requirePhone ? "bg-primary" : "bg-zinc-700"}`}>
                    <input type="checkbox" checked={currentPage.requirePhone} onChange={(e) => setCurrentPage({ ...currentPage, requirePhone: e.target.checked })} className="sr-only" />
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${currentPage.requirePhone ? "left-[22px]" : "left-0.5"}`}></div>
                  </div>
                  Require 11-Digit Phone Number
                </label>
              </div>
            </div>
          </details>

          {/* Page Content (Builder) */}
          <details open className="border-b border-zinc-800">
            <summary className="px-5 py-4 text-sm font-bold text-white cursor-pointer flex items-center gap-2 hover:bg-zinc-900/50 transition select-none">
              <PanelTop className="h-4 w-4 text-primary" />
              Page Content (Builder)
            </summary>
            <div className="px-5 pb-5">
              <p className="text-zinc-500 text-xs mb-4">Design your Landing Page by adding and reordering blocks below.</p>

              {currentPage.blocks.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={currentPage.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2 mb-4">
                      {currentPage.blocks.map((block) => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          onDelete={deleteBlock}
                          onEdit={(id) => setEditingBlockId(editingBlockId === id ? null : id)}
                          isEditing={editingBlockId === block.id}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="border-2 border-dashed border-zinc-800 rounded-xl p-6 text-center mb-4">
                  <p className="text-zinc-500 text-sm">No blocks yet. Add blocks to design your page.</p>
                </div>
              )}

              {/* Add block button */}
              <div className="relative">
                <button
                  onClick={() => setShowBlockPicker(!showBlockPicker)}
                  className="w-full py-2.5 border-2 border-dashed border-zinc-700 hover:border-primary rounded-xl text-sm text-zinc-400 hover:text-primary flex items-center justify-center gap-2 transition"
                >
                  <Plus className="h-4 w-4" /> Add to design your Landing Page
                </button>

                {showBlockPicker && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-30 overflow-hidden">
                    <div className="p-3 border-b border-zinc-800">
                      <p className="text-xs font-bold text-zinc-400">Choose a Block</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {blockTypes.map((bt) => (
                        <button
                          key={bt.type}
                          onClick={() => addBlock(bt.type)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition text-left"
                        >
                          <div className="p-1.5 rounded bg-primary/10 text-primary">{bt.icon}</div>
                          <div>
                            <p className="text-white text-sm font-medium">{bt.label}</p>
                            <p className="text-zinc-500 text-xs">{bt.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </details>
        </div>

        {/* Right Panel: Block Editor */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a0a] p-6">
          {editingBlock ? (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">{blockTypes.find((b) => b.type === editingBlock.type)?.icon}</div>
                <div>
                  <h3 className="text-white font-bold text-sm">Edit: {blockTypes.find((b) => b.type === editingBlock.type)?.label}</h3>
                  <p className="text-zinc-500 text-xs">{blockTypes.find((b) => b.type === editingBlock.type)?.description}</p>
                </div>
              </div>
              <BlockEditor block={editingBlock} onChange={(data) => updateBlockData(editingBlock.id, data)} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 rounded-2xl bg-zinc-800/50 mb-4">
                <Edit className="h-8 w-8 text-zinc-600" />
              </div>
              <h3 className="text-white font-semibold mb-2">Select a Block to Edit</h3>
              <p className="text-zinc-500 text-sm max-w-xs">
                Click the edit icon on any block in the left panel to customize its content here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
