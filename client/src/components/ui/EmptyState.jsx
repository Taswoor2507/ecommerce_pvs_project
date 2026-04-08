import { Package } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Package,
  title = 'No data found',
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 text-center max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
