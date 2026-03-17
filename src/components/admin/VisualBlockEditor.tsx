"use client";

import { 
  Trash2, 
  GripVertical, 
  Layout,
  Type,
  Briefcase,
  Zap,
  Image as ImageIcon,
  MessageSquare,
  User
} from "lucide-react";
import { Reorder } from "framer-motion";

export type BlockType = "Hero" | "Services" | "Stats" | "Projects" | "Contact" | "About";

export interface PageBlock {
  id: string;
  type: BlockType;
  data: any;
}

interface VisualBlockEditorProps {
  blocks: PageBlock[];
  onChange: (blocks: PageBlock[]) => void;
}

export function VisualBlockEditor({ blocks, onChange }: VisualBlockEditorProps) {
  const addBlock = (type: BlockType) => {
    const newBlock: PageBlock = {
      id: `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      data: getDefaultData(type),
    };
    onChange([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const updateBlockData = (id: string, data: any) => {
    onChange(blocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...data } } : b)));
  };

  const getDefaultData = (type: BlockType) => {
    switch (type) {
      case "Hero": 
        return { 
          badge: "New Generation", 
          title: "Building the Future", 
          subtitle: "Digital Excellence",
          description: "We create high-end digital experiences.",
          buttonText: "Start Project",
          buttonLink: "/contact"
        };
      case "Services":
        return {
          title: "My Services",
          items: [{ title: "Development", description: "Modern web apps", icon: "Code" }]
        };
      case "Stats":
        return { items: [{ label: "Projects", value: "50+" }] };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-8">
      {/* Block List */}
      <Reorder.Group axis="y" values={blocks} onReorder={onChange} className="space-y-4">
        {blocks.map((block) => (
          <Reorder.Item 
            key={block.id} 
            value={block}
            className="group"
          >
            <div className="glass-card rounded-3xl border border-white/5 bg-white/2 hover:border-accent/20 transition-all overflow-hidden">
              {/* Block Header */}
              <div className="bg-white/5 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white">
                    <GripVertical size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                    <Layout size={12} />
                    {block.type} Block
                  </span>
                </div>
                <button 
                  onClick={() => removeBlock(block.id)}
                  className="p-2 rounded-xl text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Block Content (Editor Form) */}
              <div className="p-8 space-y-6">
                {block.type === "Hero" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <EditorInput 
                      label="Badge" 
                      value={block.data.badge} 
                      onChange={(v: string) => updateBlockData(block.id, { badge: v })} 
                    />
                    <EditorInput 
                      label="Title" 
                      value={block.data.title} 
                      onChange={(v: string) => updateBlockData(block.id, { title: v })} 
                    />
                    <EditorInput 
                      label="Subtitle" 
                      value={block.data.subtitle} 
                      onChange={(v: string) => updateBlockData(block.id, { subtitle: v })} 
                    />
                    <EditorInput 
                      label="Description" 
                      value={block.data.description} 
                      onChange={(v: string) => updateBlockData(block.id, { description: v })} 
                      isTextArea
                    />
                  </div>
                )}
                
                {block.type === "Services" && (
                  <div className="space-y-4">
                     <EditorInput 
                      label="Section Title" 
                      value={block.data.title} 
                      onChange={(v: string) => updateBlockData(block.id, { title: v })} 
                    />
                    <p className="text-[10px] text-white/20 uppercase font-black">Dynamic items will be managed in future update</p>
                  </div>
                )}

                {block.type === "Stats" && (
                   <div className="space-y-4">
                    <p className="text-[10px] text-white/20 uppercase font-black italic">Statistics configuration enabled</p>
                  </div>
                )}
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Add Block Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-white/5">
        {(["Hero", "Services", "Stats", "Projects", "Contact", "About"] as BlockType[]).map((type) => (
          <button
            key={type}
            onClick={() => addBlock(type)}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 hover:bg-accent/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent transition-all">
              {getBlockIcon(type)}
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider">{type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EditorInput({ label, value, onChange, placeholder, isTextArea }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">{label}</label>
      {isTextArea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-accent/30 transition-all resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/20 border border-white/5 rounded-xl px-4 h-12 text-sm text-white focus:outline-none focus:border-accent/30 transition-all"
        />
      )}
    </div>
  );
}

function getBlockIcon(type: BlockType) {
  switch (type) {
    case "Hero": return <Zap size={18} />;
    case "Services": return <Briefcase size={18} />;
    case "Stats": return <Type size={18} />;
    case "Projects": return <ImageIcon size={18} />;
    case "Contact": return <MessageSquare size={18} />;
    case "About": return <User size={18} />;
    default: return <Layout size={18} />;
  }
}
