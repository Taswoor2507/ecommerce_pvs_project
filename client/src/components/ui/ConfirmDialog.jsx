import { AlertTriangle, Trash2, Info } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const intentConfig = {
  danger: {
    icon: Trash2,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    confirmVariant: 'danger',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    confirmVariant: 'primary',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    confirmVariant: 'primary',
  },
};

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  intent = 'danger',
  isLoading = false,
}) => {
  const config = intentConfig[intent];
  const Icon = config.icon;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${config.iconBg}`}
        >
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {message && (
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {message}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={config.confirmVariant}
          onClick={handleConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
