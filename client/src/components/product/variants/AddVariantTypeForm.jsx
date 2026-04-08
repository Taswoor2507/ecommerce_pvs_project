import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addVariantTypeSchema } from '../../../schemas/variant.schema';
import { Plus, X } from 'lucide-react';
import Button from '../../ui/Button';

const AddVariantTypeForm = ({ onSubmit, isSubmitting = false }) => {
  const [currentOption, setCurrentOption] = useState('');
  const [options, setOptions] = useState([]);
  const [optionError, setOptionError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addVariantTypeSchema),
    defaultValues: {
      name: '',
      options: [],
    },
  });

  const handleAddOption = () => {
    const trimmed = currentOption.trim();
    if (!trimmed) return;

    if (options.some(opt => opt.toLowerCase() === trimmed.toLowerCase())) {
      setOptionError('Duplicate options are not allowed');
      return;
    }

    const newOptions = [...options, trimmed];
    setOptions(newOptions);
    setValue('options', newOptions, { shouldValidate: true });
    setCurrentOption('');
    setOptionError('');
  };

  const removeOption = (indexToRemove) => {
    const newOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(newOptions);
    setValue('options', newOptions, { shouldValidate: true });
  };

  const handleOptionKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  const handleFormSubmit = async (data) => {
    await onSubmit({ name: data.name.trim(), options: data.options });
    reset({ name: '', options: [] });
    setOptions([]);
    setCurrentOption('');
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4"
    >
      <div>
        <label
          htmlFor="variant-type-name"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Variant Type Name
        </label>
        <input
          id="variant-type-name"
          {...register('name')}
          placeholder="e.g., Size, Color, Material"
          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
            transition-all duration-200"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Options
        </label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              value={currentOption}
              onChange={(e) => {
                setCurrentOption(e.target.value);
                if (optionError) setOptionError('');
              }}
              onKeyDown={handleOptionKeyDown}
              placeholder="Add an option (press Enter)"
              className={`flex-1 px-3.5 py-2.5 border rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
                transition-all duration-200
                ${optionError ? 'border-red-400' : 'border-slate-300'}
              `}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddOption}
              disabled={!currentOption.trim() || isSubmitting}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              Add
            </button>
          </div>
          
          {optionError && <p className="text-xs text-red-600">{optionError}</p>}
          {errors.options && !optionError && (
            <p className="text-xs text-red-600">
              {errors.options.message || errors.options.root?.message}
            </p>
          )}

          {options.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-white border border-slate-200 rounded-lg min-h-[46px]">
              {options.map((option, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-indigo-50 border border-indigo-100 text-indigo-700 group"
                >
                  {option}
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-indigo-300 hover:text-indigo-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        fullWidth
        leftIcon={<Plus className="w-4 h-4" />}
        disabled={isSubmitting}
      >
        Add Variant Type
      </Button>
    </form>
  );
};

export default AddVariantTypeForm;
