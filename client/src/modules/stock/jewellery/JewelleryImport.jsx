import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Download,
  RotateCcw,
  Save,
  Info,
} from "lucide-react";
import * as XLSX from "xlsx";
import notify from "../../../utils/notifications";
import api from "../../../services/api";

const FIELD_MAPPINGS = {
  stock_id: [
    "stock id",
    "stockid",
    "stock no",
    "stockno",
    "sku",
    "item code",
    "stock #",
  ],
  name: ["name", "title", "product name", "item name"],
  description: ["description", "desc", "details", "comments"],
  design_number: ["design number", "design no", "design #", "model no"],
  brand: ["brand", "manufacturer", "make"],
  jewelry_style: ["style", "jewelry style", "jewelry style"],
  jewelry_sub_category: [
    "category",
    "sub category",
    "sub-category",
    "item type",
    "jewellery sub category",
  ],
  status: ["status", "availability", "available", "yes"],
  material: ["material", "metal", "metal type"],
  metal_purity: ["purity", "metal purity", "karat", "kt"],
  weight: ["weight", "metal weight", "gross weight", "g wt"],
  city: ["city", "location"],
  country: ["country"],
  price: ["price", "amount", "selling price", "rate", "total price"],

  jewellery_image1: ["image url 1", "image1", "image_url_1"],
  jewellery_image2: ["image url 2", "image2", "image_url_2"],
  jewellery_image3: ["image url 3", "image3", "image_url_3"],
  jewellery_image4: ["image url 4", "image4", "image_url_4"],
  jewellery_image5: ["image url 5", "image5", "image_url_5"],
  jewellery_video: ["video url", "video", "video_url"],

  // Center stone
  center_type: ["center growth", "center stone growth", "center type"],
  center_gem_type: [
    "center stone type",
    "center gem",
    "stone type",
    "diamond type",
    "center gemtype",
  ],
  center_gem_color: [
    "center gem color",
    "stone color",
    "center gem type color",
  ],
  center_shape: ["center shape", "stone shape", "diamond shape"],
  center_weight_cts: [
    "center weight",
    "stone weight",
    "diamond weight",
    "ct",
    "cts",
    "center weight (cts)",
  ],
  center_color_grade: [
    "center color",
    "color grade",
    "color",
    "center color (d to z)",
  ],
  center_clarity: ["center clarity", "clarity grade", "clarity"],
  center_cut: ["center cut", "cut grade", "cut"],
  center_polish: ["center polish", "polish"],
  center_symmetry: ["center symmetry", "symmetry"],
  center_fancy_color: ["center fancy color", "fancy color"],
  center_fancy_intensity: ["center fancy intensity", "intensity"],
  center_fluorescence_intensity: [
    "center fluorescence",
    "fluorescence",
    "fluor",
    "center fluorescence intensity",
  ],
  center_lab: ["center lab", "lab", "center lab"],
  center_enhancement: ["center enhancement", "treatment"],
  center_total_stones: [
    "center stones count",
    "center stones",
    "center total stones",
  ],
  center_measurement_length: [
    "center length",
    "length",
    "center measurement length",
  ],
  center_measurement_width: [
    "center width",
    "width",
    "center measurement width",
  ],
  center_measurement_depth: [
    "center depth",
    "depth",
    "center measurement depth",
  ],
  center_depth_percent: ["center depth %", "depth %"],
  center_table_percent: ["center table %", "table %"],

  // Side stones
  side_stone_type: ["side stone type", "side diamond type"],
  side_gem_type: ["side gem type", "side gemtype"],
  side_gem_color: ["side gem color", "side gem type color"],
  side_shape: ["side shape", "side diamond shape"],
  side_weight_cts: [
    "side weight",
    "side stone weight",
    "side diamond weight",
    "side weight (cts)",
  ],
  side_color_grade: ["side color grade", "side color", "side color (d to z)"],
  side_clarity: ["side clarity"],
  side_fancy_color: ["side fancy color"],
  side_fancy_intensity: ["side fancy intensity"],
  side_total_stones: ["side stones count", "side stones", "side total stones"],

  mount: ["mount", "mounting", "setting"],
  setting_supported_carat_from: [
    "setting supported carat from",
    "supported carat from",
  ],
  setting_supported_carat_to: [
    "setting supported carat to",
    "supported carat to",
  ],
  supported_diamond_shapes: ["supported diamond shapes"],
  total_number_of_stones: ["total number of stones"],

  certificate_number: [
    "certificate number",
    "cert no",
    "report no",
    "certificate no",
  ],
  certificate_comment: ["certificate comment"],
  certificate_url: ["certificate url", "cert link", "report link"],
  lab: ["certificate lab", "lab"],
  rank: ["rank"],
  is_featured: ["featured", "is featured"],
  is_customizable: ["customizable"],
};

const normalizeFieldName = (field) => {
  if (!field) return "";
  const normalized = String(field)
    .toLowerCase()
    .trim()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ");

  for (const [standard, variations] of Object.entries(FIELD_MAPPINGS)) {
    if (variations.includes(normalized)) return standard;
  }
  return normalized.replace(/\s+/g, "_");
};

const JewelleryImport = ({ onComplete, onCancel }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = useCallback((uploadedFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          notify.error("Empty File", "No data found in the uploaded file.");
          return;
        }

        const mappedData = jsonData.map((row) => {
          const mappedRow = {};
          Object.entries(row).forEach(([key, value]) => {
            const normalizedKey = normalizeFieldName(key);
            if (normalizedKey) mappedRow[normalizedKey] = value;
          });
          return mappedRow;
        });

        const validData = mappedData.filter(
          (row) => row.stock_id && String(row.stock_id).trim() !== "",
        );
        const skippedCount = mappedData.length - validData.length;

        if (validData.length === 0) {
          notify.error(
            "No Valid Data",
            "No rows with a valid Stock ID were found.",
          );
          return;
        }

        setData(validData);
        setFile(uploadedFile);

        if (skippedCount > 0) {
          notify.warning(
            "Data Filtered",
            `Loaded ${validData.length} items. Skipped ${skippedCount} rows missing Stock ID.`,
          );
        } else {
          notify.success(
            "File Parsed",
            `Loaded ${validData.length} items from ${uploadedFile.name}`,
          );
        }
      } catch (error) {
        console.error("Error parsing Excel:", error);
        notify.error("Parse Error", "Failed to parse the Excel file.");
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  }, []);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) processFile(uploadedFile);
  };

  const handleSubmit = async () => {
    if (data.length === 0) return;

    setIsImporting(true);
    try {
      const response = await api.post("/jewellry-stock/bulk-upload", {
        stock: data,
      });
      if (response.data.success) {
        const result = response.data.data;
        const replaceMsg =
          result.updatedCount > 0
            ? `, updated ${result.updatedCount} existing`
            : "";
        notify.success(
          "Import Complete",
          `Saved ${result.insertedCount} rows${replaceMsg}, skipped ${result.skippedCount} rows`,
        );
        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error("Import error:", error);
      notify.error(
        "Import Failed",
        error.response?.data?.message || "Failed to upload stock",
      );
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const headers = Object.keys(FIELD_MAPPINGS);
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Jewellery_Import_Template.xlsx");
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm">
      <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight">
              Bulk Import Jewellery
            </h2>
            <p className="text-[10px] text-[#64748B] font-bold uppercase tracking-widest">
              Excel / CSV Data reconciliation
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-8">
        {!file ? (
          <div className="space-y-6">
            {/* 3-Card Options Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-white rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 p-6 cursor-pointer transition-all hover:shadow-lg group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all text-emerald-600">
                    <FileSpreadsheet className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-[#0F172A] mb-1">Excel / CSV</h3>
                  <p className="text-xs text-[#64748B]">
                    Upload .xlsx, .xls, or .csv
                  </p>
                </div>
              </div>

              <div
                onClick={downloadTemplate}
                className="bg-white rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 p-6 cursor-pointer transition-all hover:shadow-lg group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-all text-amber-600">
                    <Download className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-[#0F172A] mb-1">Template</h3>
                  <p className="text-xs text-[#64748B]">
                    Download recommended format
                  </p>
                </div>
              </div>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const f = e.dataTransfer.files[0];
                if (f) processFile(f);
              }}
              className={`relative h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50 scale-[0.99]"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-emerald-300"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-emerald-600">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[#0F172A]">
                  Drop your file here, or{" "}
                  <span className="text-emerald-600">browse</span>
                </p>
                <p className="text-[10px] text-[#64748B] mt-1 uppercase font-black tracking-widest">
                  CSV, XLSX, XLS up to 10MB
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 bg-emerald-50 border border-emerald-100 rounded-2xl gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-900 uppercase tracking-tight">
                    {file.name}
                  </p>
                  <p className="text-xs font-bold text-emerald-700">
                    {data.length} items ready to import
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setFile(null);
                    setData([]);
                  }}
                  className="px-4 py-2 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 rounded-lg transition-all"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-auto max-h-[400px]">
              <table className="w-full text-[11px] border-collapse">
                <thead className="sticky top-0 bg-slate-800 text-white z-10">
                  <tr>
                    {Object.keys(FIELD_MAPPINGS).map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left font-black uppercase tracking-wider border-r border-white/10 whitespace-nowrap"
                      >
                        {header.replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 50).map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      {Object.keys(FIELD_MAPPINGS).map((header) => (
                        <td
                          key={header}
                          className="px-4 py-2.5 text-slate-700 truncate max-w-[200px] border-r border-slate-50"
                        >
                          {row[header] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setFile(null);
                  setData([]);
                }}
                className="px-8 py-3 rounded-xl border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isImporting}
                className="flex-1 px-8 py-3 rounded-xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isImporting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Import {data.length} Items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JewelleryImport;
