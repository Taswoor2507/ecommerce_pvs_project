import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addVariantTypeSchema } from '../../../schemas/variant.schema';
import { Plus, X } from 'lucide-react';
import Button from '../../ui/Button';

const AddVariantTypeForm = ({ onSubmit, isSubmitting = false }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addVariantTypeSchema),
    defaultValues: {
      name: '',
      options: [''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const handleFormSubmit = async (data) => {
    const validOptions = data.options.filter((opt) => opt.trim().length > 0);
    await onSubmit({ name: data.name.trim(), options: validOptions });
    reset({ name: '', options: [''] });
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
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Options
        </label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                {...register(`options.${index}`)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
                  transition-all duration-200"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {errors.options && (
            <p className="text-xs text-red-600">
              {errors.options.message || errors.options.root?.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => append('')}
          className="mt-2 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add another option
        </button>
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        fullWidth
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Add Variant Type
      </Button>
    </form>
  );
};

export default AddVariantTypeForm;
