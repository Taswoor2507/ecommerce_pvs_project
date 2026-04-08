import VariantTypesManager from '../variants/VariantTypesManager';
import CombinationsTable from '../variants/CombinationsTable';
import { CardTitle } from '../../ui/Card';

const VariantsTab = ({
  product,
  combinations,
  variantMutation,
}) => {
  const handleAddVariantType = async (data) => {
    await variantMutation.addVariantType(data);
  };

  const handleAddOption = async (variantTypeId, value) => {
    await variantMutation.addOption({ variantTypeId, option: value });
  };

  const handleDeleteVariantType = async (variantTypeId) => {
    await variantMutation.deleteVariantType(variantTypeId);
  };

  const handleDeleteOption = async (optionId) => {
    await variantMutation.deleteOption(optionId);
  };

  const handleUpdateCombination = async (combinationId, updates) => {
    await variantMutation.updateCombination({
      combinationId,
      payload: updates,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <CardTitle className="mb-4">Variant Types</CardTitle>
        <VariantTypesManager
          variantTypes={product?.variant_types || []}
          onAddVariantType={handleAddVariantType}
          onDeleteVariantType={handleDeleteVariantType}
          onAddOption={handleAddOption}
          onDeleteOption={handleDeleteOption}
          isAddingVariantType={variantMutation.isAddingVariantType}
          isDeletingVariantType={variantMutation.isDeletingVariantType}
          isAddingOption={variantMutation.isAddingOption}
          isDeletingOption={variantMutation.isDeletingOption}
        />
      </div>

      <div>
        <CardTitle className="mb-4">
          Combinations ({combinations?.length || 0})
        </CardTitle>
        <CombinationsTable
          combinations={combinations}
          basePrice={product?.base_price || 0}
          onUpdateCombination={handleUpdateCombination}
          isUpdating={variantMutation.isUpdatingCombination}
        />
      </div>
    </div>
  );
};

export default VariantsTab;
