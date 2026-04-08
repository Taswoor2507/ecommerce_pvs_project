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
      className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${className}`}
    >
      <div className="flex items-start gap-3 md:gap-4 min-w-0">
        {(backTo || onBack) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBack}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">{backLabel}</span>
          </Button>
        )}
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-slate-500 mt-0.5 md:mt-1 truncate opacity-80">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 md:gap-3 flex-wrap sm:flex-nowrap">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
