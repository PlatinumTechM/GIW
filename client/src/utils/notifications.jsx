import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

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

// Main notify object - simplified with only 4 notification types
const notify = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
};

export default notify;
