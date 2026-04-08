import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const PageHeader = ({
  title,
  subtitle,
  backTo,
  onBack,
  backLabel = 'Back',
  actions,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backTo);
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-4 min-w-0">
        {(backTo || onBack) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </Button>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>
      )}
    </div>
  );
};

export default PageHeader;
