import React from "react";
import { 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Video,
  Image as ImageIcon,
  Gem,
  RefreshCw,
  CheckCircle,
  Play,
  Pause
} from "lucide-react";

const JewelleryTable = ({ 
  data, 
  loading, 
  onEdit, 
  onDelete, 
  pagination, 
  onPageChange,
  selectedRows = [],
  onSelectRow,
  onSelectAll
}) => {
  const fields = [
    "stock_id", "type", "name", "description", "design_number", "brand", 
    "jewelry_style", "jewelry_sub_category", "status", "material", "metal_purity", 
    "weight", "city", "country", "price",
    "center_type", "center_gem_type", "center_gem_color", "center_shape", 
    "center_weight_cts", "center_color_grade", "center_clarity", "center_cut", 
    "center_polish", "center_symmetry", "center_fancy_color", "center_fancy_intensity", 
    "center_fluorescence_intensity", "center_lab", "center_enhancement", "center_total_stones", 
    "center_measurement_length", "center_measurement_width", "center_measurement_depth", 
    "center_depth_percent", "center_table_percent",
    "side_stone_type", "side_gem_type", "side_gem_color", "side_shape", 
    "side_weight_cts", "side_color_grade", "side_clarity", "side_fancy_color", 
    "side_fancy_intensity", "side_total_stones",
    "mount", "setting_supported_carat_from", "setting_supported_carat_to", 
    "supported_diamond_shapes", "total_number_of_stones",
    "certificate_number", "certificate_url", "certificate_comment", "lab", 
    "rank", "is_customizable", "is_featured"
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 items-center animate-pulse">
              <div className="h-4 w-10 bg-gray-100 rounded" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-4 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-32 bg-gray-100 rounded ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const SimpleTableRow = ({ item, index, page }) => {
    const rowNumber = (page - 1) * (pagination?.limit || 50) + index + 1;
    const isSelected = selectedRows.includes(item.id);
    const rowBgClass = index % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]";

    return (
      <tr 
        onClick={() => onSelectRow(item.id)}
        className={`${rowBgClass} ${isSelected ? "bg-blue-50" : ""} hover:bg-[#EFF6FF] transition-colors text-sm border-b border-[#E2E8F0] cursor-pointer`}
      >
        {/* Checkbox and Row Number */}
        <td className={`px-2 py-3 text-center text-xs text-[#64748B] border-r border-[#E2E8F0] sticky left-0 z-20 w-16 font-medium ${rowBgClass} ${isSelected ? "bg-blue-50" : ""}`}>
          <div className="flex items-center gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectRow(item.id)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <span>{rowNumber}</span>
          </div>
        </td>

        {/* Fields */}
        {fields.map((field) => {
          const value = item[field] || "-";
          const isEmpty = value === "-";

          return (
            <td key={field} className={`px-2 sm:px-3 py-2 sm:py-3 border-r border-[#E2E8F0] whitespace-nowrap text-xs sm:text-sm ${isEmpty ? "text-[#94A3B8]" : "text-[#374151]"}`}>
              {field === "stock_id" && !isEmpty ? (
                <span className="font-semibold text-[#1E3A8A]">{value}</span>
              ) : field === "status" ? (
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border shadow-sm uppercase tracking-wider ${
                  item.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                  item.status === "SOLD" ? "bg-rose-100 text-rose-700 border-rose-200" :
                  "bg-amber-100 text-amber-700 border-amber-200"
                }`}>
                  {value}
                </span>
              ) : field === "price" && !isEmpty ? (
                <span className="font-semibold text-emerald-700">₹{Number(value).toLocaleString()}</span>
              ) : field === "weight" && !isEmpty ? (
                <span className="font-medium">{value} G</span>
              ) : (field.includes("weight") || field.includes("carat")) && !isEmpty ? (
                <span className="font-medium">{value} CT</span>
              ) : field === "name" && !isEmpty ? (
                <span className="font-medium text-[#0F172A]">{value}</span>
              ) : (
                value
              )}
            </td>
          );
        })}

        {/* Media Icons */}
        <td className="px-2 py-3 border-r border-[#E2E8F0] whitespace-nowrap text-center bg-inherit">
            <div className="flex items-center justify-center gap-2">
                {item.jewellery_image1 && (
                    <a href={item.jewellery_image1} target="_blank" rel="noreferrer" title="View Image" onClick={e => e.stopPropagation()}>
                        <ImageIcon className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                    </a>
                )}
                {item.jewellery_video && (
                    <a href={item.jewellery_video} target="_blank" rel="noreferrer" title="View Video" onClick={e => e.stopPropagation()}>
                        <Video className="w-4 h-4 text-purple-500 hover:text-purple-700" />
                    </a>
                )}
            </div>
        </td>

        {/* Actions */}
        <td className="px-2 py-2 border-r border-[#E2E8F0] text-center sticky right-0 bg-white shadow-[-2px_0_4px_rgba(0,0,0,0.05)] z-20" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center gap-1">
            <button onClick={() => onEdit(item)} className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-all" title="Edit">
              <Edit className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <button onClick={() => onDelete(item.id)} className="p-1.5 bg-rose-100 text-rose-600 rounded-full hover:bg-rose-200 transition-all" title="Delete">
              <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Result Summary Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center justify-between shadow-sm">
        <span className="text-sm text-[#64748B] font-medium">
          Showing <span className="font-bold text-[#0F172A]">{data.length}</span> items
          {pagination && (
            <>
              {" "}of <span className="font-bold text-[#0F172A]">{pagination.totalCount}</span> total pieces
            </>
          )}
        </span>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sold</span>
           </div>
        </div>
      </div>

      {/* Wide Table Container */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-auto max-h-[75vh]">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-40 bg-gray-200">
            <tr className="bg-gray-200 text-gray-900">
              <th className="px-2 py-3 text-center border-r border-gray-300 sticky left-0 z-50 w-16 bg-gray-300 font-semibold text-xs uppercase">
                 <div className="flex items-center gap-2 justify-center">
                    <input
                      type="checkbox"
                      checked={data.length > 0 && selectedRows.length === data.length}
                      onChange={onSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>#</span>
                 </div>
              </th>
              {fields.map((field) => (
                <th key={field} className="px-3 py-3 text-left border-r border-gray-300 whitespace-nowrap text-xs font-black uppercase bg-gray-200 text-slate-700 tracking-wider">
                  {field.replace(/_/g, " ")}
                </th>
              ))}
              <th className="px-3 py-3 text-center border-r border-gray-300 bg-gray-200 text-xs font-black uppercase text-slate-700 tracking-wider">Media</th>
              <th className="px-3 py-3 text-center sticky right-0 z-50 bg-gray-300 border-l border-gray-300 text-xs font-black uppercase text-slate-700 tracking-wider w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={fields.length + 3} className="px-6 py-20 text-center text-[#64748B] font-bold uppercase tracking-[0.2em] text-xs">
                  No jewellery stock found matching your criteria.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <SimpleTableRow 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  page={pagination?.page || 1} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default JewelleryTable;
