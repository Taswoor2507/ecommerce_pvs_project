import { useState } from 'react';
import { Trash2, X, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import IconButton from '../../ui/IconButton';
import ConfirmDialog from '../../ui/ConfirmDialog';
import AddOptionInline from './AddOptionInline';

const VariantTypeCard = ({
  variantType,
  onDeleteType,
  onDeleteOption,
  onAddOption,
  isDeletingType = false,
  isDeletingOption = false,
  isAddingOption = false,
}) => {
  const [showAddOption, setShowAddOption] = useState(false);
  const [deleteTypeConfirm, setDeleteTypeConfirm] = useState(false);
  const [deleteOptionConfirm, setDeleteOptionConfirm] = useState(null);

  const handleAddOption = async (value) => {
    await onAddOption(variantType._id, value);
    setShowAddOption(false);
  };

  return (
    <>
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">
              {variantType.name}
            </span>
            <span className="text-xs text-slate-400">
              {variantType.options?.length || 0} options
            </span>
          </div>
          <div className="flex items-center gap-1">
            <IconButton
              icon={Plus}
              variant="ghost"
              size="sm"
              onClick={() => setShowAddOption((p) => !p)}
              ariaLabel="Add option"
            />
            <IconButton
              icon={Trash2}
              variant="danger"
              size="sm"
              onClick={() => setDeleteTypeConfirm(true)}
              isLoading={isDeletingType}
              ariaLabel="Delete variant type"
            />
          </div>
        </div>

        <div className="px-4 py-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            {variantType.options?.map((option) => (
              <span
                key={option._id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-white border border-slate-200 text-slate-700 group hover:border-slate-300 transition-colors"
              >
                {option.value}
                <button
                  onClick={() => setDeleteOptionConfirm(option)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                  disabled={isDeletingOption}
                  aria-label={`Remove ${option.value}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(!variantType.options || variantType.options.length === 0) && (
              <p className="text-sm text-slate-400 italic">No options added yet</p>
            )}
          </div>

          {showAddOption && (
            <AddOptionInline
              onSubmit={handleAddOption}
              isSubmitting={isAddingOption}
            />
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteTypeConfirm}
        onClose={() => setDeleteTypeConfirm(false)}
        onConfirm={() => onDeleteType(variantType._id)}
        title={`Delete "${variantType.name}"?`}
        message="This will remove all associated options and regenerate combinations. This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeletingType}
      />

      <ConfirmDialog
        isOpen={!!deleteOptionConfirm}
        onClose={() => setDeleteOptionConfirm(null)}
        onConfirm={() => onDeleteOption(deleteOptionConfirm._id)}
        title={`Remove "${deleteOptionConfirm?.value}"?`}
        message="This may affect existing combinations. This action cannot be undone."
        confirmLabel="Remove"
        isLoading={isDeletingOption}
      />
    </>
  );
};

export default VariantTypeCard;
