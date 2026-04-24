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
  Gem
} from "lucide-react";

const JewelleryTable = ({ 
  data, 
  loading, 
  onEdit, 
  onDelete, 
  pagination, 
  onPageChange,
  onSearch,
  searchQuery
}) => {
  const fields = [
    "stock_id", "category", "name", "material", "weight", 
    "diamond_type", "diamond_shape", "diamond_weight", "total_diamond_weight", "diamond_color", 
    "diamond_clarity", "diamond_cut", "diamond_growth", "description",
    "status", "price"
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
    const rowNumber = (page - 1) * (pagination?.limit || 10) + index + 1;
    const rowBgClass = index % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]";

    return (
      <tr className={`${rowBgClass} hover:bg-[#EFF6FF] transition-colors text-sm border-b border-[#E2E8F0]`}>
        {/* Row Number */}
        <td className={`px-2 py-3 text-center text-xs text-[#64748B] border-r border-[#E2E8F0] sticky left-0 z-20 w-10 font-medium ${rowBgClass}`}>
          {rowNumber}
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
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                  item.status === "AVAILABLE" ? "bg-green-50 text-green-700 border-green-200" :
                  item.status === "SOLD" ? "bg-red-50 text-red-700 border-red-200" :
                  "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {value}
                </span>
              ) : field === "price" && !isEmpty ? (
                <span className="font-semibold text-green-700">₹{Number(value).toLocaleString()}</span>
              ) : field === "weight" && !isEmpty ? (
                <span className="font-medium">{value} G</span>
              ) : (field === "diamond_weight" || field === "total_diamond_weight") && !isEmpty ? (
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
        <td className="px-2 py-3 border-r border-[#E2E8F0] whitespace-nowrap text-center">
            <div className="flex items-center justify-center gap-2">
                {item.jewellery_image1 && (
                    <a href={item.jewellery_image1} target="_blank" rel="noreferrer" title="View Image">
                        <ImageIcon className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                    </a>
                )}
                {item.jewellery_video && (
                    <a href={item.jewellery_video} target="_blank" rel="noreferrer" title="View Video">
                        <Video className="w-4 h-4 text-purple-500 hover:text-purple-700" />
                    </a>
                )}
            </div>
        </td>

        {/* Actions */}
        <td className="px-3 py-2 whitespace-nowrap text-right sticky right-0 z-20 bg-inherit border-l border-[#E2E8F0]">
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => onEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Result Summary Bar */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-3 flex items-center justify-between">
        <span className="text-sm text-[#64748B] font-medium">
          Showing <span className="font-bold text-[#0F172A]">{data.length}</span> items
          {pagination && (
            <>
              {" "}of <span className="font-bold text-[#0F172A]">{pagination.totalCount}</span> total pieces
              (Page <span className="font-bold text-[#0F172A]">{pagination.page}</span> of {pagination.totalPages})
            </>
          )}
        </span>
      </div>

      {/* Wide Table Container */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-auto max-h-[75vh]">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-40 bg-gray-200">
            <tr className="bg-gray-200 text-gray-900">
              <th className="px-2 py-3 text-center border-r border-gray-300 sticky left-0 z-50 w-10 bg-gray-300 font-semibold text-xs uppercase">#</th>
              {fields.map((field) => (
                <th key={field} className="px-3 py-3 text-left border-r border-gray-300 whitespace-nowrap text-xs font-semibold uppercase bg-gray-200">
                  {field.replace(/_/g, " ").toUpperCase()}
                </th>
              ))}
              <th className="px-3 py-3 text-center border-r border-gray-300 bg-gray-200 text-xs font-semibold uppercase">Media</th>
              <th className="px-3 py-3 text-right sticky right-0 z-50 bg-gray-300 border-l border-gray-300 text-xs font-semibold uppercase w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={fields.length + 3} className="px-6 py-20 text-center text-[#64748B] font-medium">
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

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-4 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-xl">
          <p className="text-sm text-[#64748B] font-medium uppercase tracking-wider">
            Page <span className="font-bold text-[#0F172A]">{pagination.page}</span> of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors uppercase tracking-widest"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors uppercase tracking-widest"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JewelleryTable;
