import { Layers } from 'lucide-react';
import AddVariantTypeForm from './AddVariantTypeForm';
import VariantTypeCard from './VariantTypeCard';
import EmptyState from '../../ui/EmptyState';

const VariantTypesManager = ({
  variantTypes = [],
  onAddVariantType,
  onDeleteVariantType,
  onAddOption,
  onDeleteOption,
  isAddingVariantType,
  isDeletingVariantType,
  isAddingOption,
  isDeletingOption,
}) => {
  return (
    <div className="space-y-6">
      <AddVariantTypeForm
        onSubmit={onAddVariantType}
        isSubmitting={isAddingVariantType}
      />

      {variantTypes.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No variant types yet"
          description="Add your first variant type above to get started"
        />
      ) : (
        <div className="space-y-3">
          {variantTypes.map((vt) => (
            <VariantTypeCard
              key={vt._id}
              variantType={vt}
              onDeleteType={onDeleteVariantType}
              onDeleteOption={onDeleteOption}
              onAddOption={onAddOption}
              isDeletingType={isDeletingVariantType}
              isDeletingOption={isDeletingOption}
              isAddingOption={isAddingOption}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VariantTypesManager;
