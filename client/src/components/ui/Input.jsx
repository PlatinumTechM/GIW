const Input = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  isFocused,
  required = false,
  icon = null,
  rightElement = null,
  className = "",
  autoComplete = "",
}) => {
  const baseClasses = `w-full px-3 py-2 ${icon ? "pl-10" : ""} border border-gray-200 rounded-md`;

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`${baseClasses} ${rightElement ? "pr-12" : ""} ${className}`}
        required={required}
        autoComplete={autoComplete}
      />
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  );
};

export default Input;
