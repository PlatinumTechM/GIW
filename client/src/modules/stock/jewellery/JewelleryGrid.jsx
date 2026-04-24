import React from "react";
import { motion } from "framer-motion";
import { 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Tag, 
  Scale, 
  Gem,
  ExternalLink,
  Package,
  Layers
} from "lucide-react";

const JewelleryGrid = ({ data, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4 animate-pulse">
            <div className="aspect-square bg-slate-100 rounded-xl" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No stock items found</h3>
        <p className="text-sm text-slate-500">Try adjusting your filters or add a new piece.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {data.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group relative bg-white rounded-2xl border border-slate-100 hover:border-[#1E3A8A]/30 hover:shadow-xl hover:shadow-[#1E3A8A]/5 transition-all duration-500 overflow-hidden flex flex-col"
        >
          {/* Image Container */}
          <div className="aspect-[3/2] relative overflow-hidden bg-slate-50 border-b border-slate-50">
            {item.jewellery_image1 ? (
              <img
                src={item.jewellery_image1}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                <ImageIcon className="w-6 h-6 mb-1 stroke-[1.2]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-2 left-2">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest shadow-md ${
                item.status === "AVAILABLE" 
                  ? "bg-emerald-500 text-white" 
                  : item.status === "SOLD"
                    ? "bg-rose-500 text-white"
                    : "bg-amber-500 text-white"
              }`}>
                {item.status}
              </span>
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
              <button
                onClick={() => onEdit(item)}
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-all shadow-lg"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black text-[#B8860B] uppercase tracking-[0.1em]">{item.category}</span>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">#{item.stock_id?.slice(-6)}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#1E3A8A] transition-colors leading-snug">
                {item.name || "Untitled Piece"}
              </h3>
            </div>

            {/* Main Specifications Grid */}
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 py-3 border-y border-slate-50">
              <div className="flex items-center gap-2.5">
                <Scale className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-xs font-bold text-[#334155]">{item.weight}g</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Tag className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-xs font-bold text-[#334155] truncate">{item.material}</span>
              </div>
              
              {item.diamond_weight && (
                <>
                  <div className="flex items-center gap-2.5">
                    <Gem className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    <span className="text-xs font-bold text-[#1E3A8A]">{item.diamond_weight} CT</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-3.5 h-3.5 text-[#64748B]" />
                    <span className="text-[10px] font-black text-[#64748B] uppercase tracking-wider truncate">{item.diamond_shape}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-auto pt-1">
               <div className="flex items-end justify-between">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Market Price</span>
                    <span className="text-base font-black text-[#1E3A8A] tracking-tight">₹{Number(item.price).toLocaleString()}</span>
                 </div>
                 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-[#1E3A8A]/10 group-hover:text-[#1E3A8A] transition-all text-slate-300">
                    <ExternalLink className="w-4 h-4" />
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default JewelleryGrid;
