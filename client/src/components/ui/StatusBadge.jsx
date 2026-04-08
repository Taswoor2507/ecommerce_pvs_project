const presets = {
  stock: (value) => {
    if (value === 0) return { label: 'Out of Stock', variant: 'danger' };
    if (value < 10) return { label: 'Low Stock', variant: 'warning' };
    return { label: 'In Stock', variant: 'success' };
  },
  status: (value) => {
    const map = {
      active: { label: 'Active', variant: 'success' },
      inactive: { label: 'Inactive', variant: 'secondary' },
      draft: { label: 'Draft', variant: 'warning' },
    };
    return map[value] || map.draft;
  },
};

const variantClasses = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  secondary: 'bg-slate-100 text-slate-700 border-slate-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const StatusBadge = ({
  type,
  value,
  label: customLabel,
  variant: customVariant,
  className = '',
}) => {
  let label = customLabel;
  let variant = customVariant || 'secondary';

  if (type && presets[type]) {
    const preset = presets[type](value);
    label = label || preset.label;
    variant = customVariant || preset.variant;
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 text-xs font-semibold
        rounded-full border
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
