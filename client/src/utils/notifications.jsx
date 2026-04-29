import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom toast styles - professional diamond theme
const toastStyles = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    style: {
      background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
      color: "#d1fae5",
      border: "1px solid #10b981",
      padding: "12px 16px",
      borderRadius: "8px",
    },
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-rose-400" />,
    style: {
      background: "linear-gradient(135deg, #881337 0%, #9f1239 100%)",
      color: "#ffe4e6",
      border: "1px solid #f43f5e",
      padding: "12px 16px",
      borderRadius: "8px",
    },
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    style: {
      background: "linear-gradient(135deg, #78350f 0%, #92400e 100%)",
      color: "#fef3c7",
      border: "1px solid #f59e0b",
      padding: "12px 16px",
      borderRadius: "8px",
    },
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-400" />,
    style: {
      background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
      color: "#dbeafe",
      border: "1px solid #3b82f6",
      padding: "12px 16px",
      borderRadius: "8px",
    },
  },
};

// Success notification
export const showSuccess = (title, message, options = {}) => {
  toast.success(
    <div className="flex flex-col gap-1">
      <span className="font-semibold">{title}</span>
      {message && <span className="text-sm opacity-90">{message}</span>}
    </div>,
    {
      icon: toastStyles.success.icon,
      style: toastStyles.success.style,
      duration: options.duration || 4000,
      ...options,
    }
  );
};

// Error notification
export const showError = (title, message, options = {}) => {
  toast.error(
    <div className="flex flex-col gap-1">
      <span className="font-semibold">{title}</span>
      {message && <span className="text-sm opacity-90">{message}</span>}
    </div>,
    {
      icon: toastStyles.error.icon,
      style: toastStyles.error.style,
      duration: options.duration || 5000,
      ...options,
    }
  );
};

// Warning notification
export const showWarning = (title, message, options = {}) => {
  toast(
    <div className="flex flex-col gap-1">
      <span className="font-semibold">{title}</span>
      {message && <span className="text-sm opacity-90">{message}</span>}
    </div>,
    {
      icon: toastStyles.warning.icon,
      style: toastStyles.warning.style,
      duration: options.duration || 4000,
      ...options,
    }
  );
};

// Info notification
export const showInfo = (title, message, options = {}) => {
  toast(
    <div className="flex flex-col gap-1">
      <span className="font-semibold">{title}</span>
      {message && <span className="text-sm opacity-90">{message}</span>}
    </div>,
    {
      icon: toastStyles.info.icon,
      style: toastStyles.info.style,
      duration: options.duration || 4000,
      ...options,
    }
  );
};

// Confirm dialog
export const showConfirm = (options = {}) => {
  const {
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    variant = "danger", // 'danger' | 'warning' | 'info'
  } = options;

  return new Promise((resolve) => {
    toast.custom(
      (t) => {
        return createPortal(
          <AnimatePresence mode="wait">
            {t.visible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
                onClick={() => {
                  toast.dismiss(t.id);
                  if (onCancel) onCancel();
                  resolve(false);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${variant === "danger" ? "bg-[#EF4444]/10" : "bg-amber-100"
                        }`}
                    >
                      <AlertTriangle
                        className={`w-6 h-6 ${variant === "danger" ? "text-[#EF4444]" : "text-amber-600"
                          }`}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
                  </div>
                  <div className="text-[#64748B] mb-6">
                    {typeof message === "string" ? <p>{message}</p> : message}
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        if (onCancel) onCancel();
                        resolve(false);
                      }}
                      className="px-4 py-2.5 text-[#475569] font-medium hover:bg-[#F1F5F9] rounded-xl transition-colors"
                    >
                      {cancelText}
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        toast.dismiss(t.id);
                        if (onConfirm) onConfirm();
                        resolve(true);
                      }}
                      className={`inline-flex items-center gap-2 px-6 py-2.5 text-white font-medium rounded-xl transition-all ${variant === "danger"
                          ? "bg-[#EF4444] hover:bg-[#DC2626] shadow-lg shadow-red-100"
                          : "bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 shadow-lg shadow-blue-100"
                        }`}
                    >
                      {variant === "danger" && <Trash2 className="w-4 h-4" />}
                      {confirmText}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        );
      },
      { duration: Infinity }
    );
  });
};

// Main notify object
const notify = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  confirm: showConfirm,
};

export default notify;

