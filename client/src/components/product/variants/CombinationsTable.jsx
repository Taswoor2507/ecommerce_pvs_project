import { useState, useCallback } from 'react';
import { Edit3, Check, X, Box } from 'lucide-react';
import IconButton from '../../ui/IconButton';
import StatusBadge from '../../ui/StatusBadge';
import EmptyState from '../../ui/EmptyState';

const CombinationRow = ({
  combination,
  basePrice,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  isSaving,
}) => {
  const [stock, setStock] = useState(combination.stock ?? 0);
  const [additionalPrice, setAdditionalPrice] = useState(
    combination.additional_price ?? 0
  );

  const handleStartEdit = () => {
    setStock(combination.stock ?? 0);
    setAdditionalPrice(combination.additional_price ?? 0);
    onStartEdit(combination._id);
  };

  const handleSave = () => {
    onSave(combination._id, {
      stock: parseInt(stock) || 0,
      additional_price: parseFloat(additionalPrice) || 0,
    });
  };

  const finalPrice = basePrice + (isEditing ? parseFloat(additionalPrice) || 0 : combination.additional_price || 0);

  return (
    <tr className="hover:bg-slate-50/60 transition-colors duration-150">
      <td className="px-5 py-3.5">
        <div className="flex flex-wrap gap-1.5">
          {combination.option_labels?.map((label, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
            >
              <span className="text-slate-400 mr-1">{label.type}:</span>
              {label.value}
            </span>
          ))}
        </div>
      </td>

      <td className="px-5 py-3.5">
        {isEditing ? (
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
          />
        ) : (
          <span
            className={`text-sm font-semibold ${
              combination.stock === 0
                ? 'text-red-600'
                : combination.stock < 10
                ? 'text-amber-600'
                : 'text-emerald-600'
            }`}
          >
            {combination.stock}
          </span>
        )}
      </td>

      <td className="px-5 py-3.5">
        {isEditing ? (
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input
              type="number"
              value={additionalPrice}
              onChange={(e) => setAdditionalPrice(e.target.value)}
              min="0"
              step="0.01"
              className="w-24 pl-6 pr-2.5 py-1.5 border border-slate-300 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400"
            />
          </div>
        ) : (
          <span className="text-sm text-slate-700">
            ${(combination.additional_price ?? 0).toFixed(2)}
          </span>
        )}
      </td>

      <td className="px-5 py-3.5">
        <span className="text-sm font-semibold text-slate-900">
          ${finalPrice.toFixed(2)}
        </span>
      </td>

      <td className="px-5 py-3.5">
        <StatusBadge type="stock" value={combination.stock} />
      </td>

      <td className="px-5 py-3.5">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <IconButton
              icon={Check}
              variant="primary"
              size="sm"
              onClick={handleSave}
              isLoading={isSaving}
              ariaLabel="Save changes"
            />
            <IconButton
              icon={X}
              variant="ghost"
              size="sm"
              onClick={onCancel}
              ariaLabel="Cancel editing"
            />
          </div>
        ) : (
          <IconButton
            icon={Edit3}
            variant="ghost"
            size="sm"
            onClick={handleStartEdit}
            ariaLabel="Edit combination"
          />
        )}
      </td>
    </tr>
  );
};

const CombinationsTable = ({
  combinations = [],
  basePrice = 0,
  onUpdateCombination,
  isUpdating = false,
}) => {
  const [editingId, setEditingId] = useState(null);

  const handleSave = useCallback(
    async (combinationId, updates) => {
      await onUpdateCombination(combinationId, updates);
      setEditingId(null);
    },
    [onUpdateCombination]
  );

  if (!combinations.length) {
    return (
      <EmptyState
        icon={Box}
        title="No combinations yet"
        description="Add variant types and options to automatically generate combinations"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200/60 bg-slate-50/80">
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Variant
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Additional Price
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Final Price
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {combinations.map((combination) => (
            <CombinationRow
              key={combination._id}
              combination={combination}
              basePrice={basePrice}
              isEditing={editingId === combination._id}
              onStartEdit={setEditingId}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
              isSaving={isUpdating}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CombinationsTable;
