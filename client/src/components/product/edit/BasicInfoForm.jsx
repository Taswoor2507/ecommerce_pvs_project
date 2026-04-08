import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProductSchema } from '../../../schemas/product.schema';
import { DollarSign } from 'lucide-react';

const BasicInfoForm = ({ product, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: '',
      description: '',
      base_price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        description: product.description || '',
        base_price: product.base_price || 0,
        stock: product.stock || 0,
      });
    }
  }, [product, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      image:
        product?.image ||
        'https://www.inkfactory.pk/wp-content/uploads/2019/08/T-Shirt-Mockup-007.jpg',
      is_active: product?.is_active !== false,
    });
  };

  return (
    <form
      id="product-basic-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="product-name"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="product-name"
            {...register('name')}
            placeholder="Enter product name"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
              transition-all duration-200
              ${errors.name ? 'border-red-400' : 'border-slate-300'}
            `}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="product-price"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Base Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="product-price"
              type="number"
              step="0.01"
              min="0"
              {...register('base_price', { valueAsNumber: true })}
              placeholder="0.00"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
                transition-all duration-200
                ${errors.base_price ? 'border-red-400' : 'border-slate-300'}
              `}
            />
          </div>
          {errors.base_price && (
            <p className="mt-1 text-xs text-red-600">
              {errors.base_price.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="product-stock"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Stock (for products without variants)
          </label>
          <input
            id="product-stock"
            type="number"
            min="0"
            {...register('stock', { valueAsNumber: true })}
            placeholder="0"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
              transition-all duration-200
              ${errors.stock ? 'border-red-400' : 'border-slate-300'}
            `}
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-red-600">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="product-image"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Product Image URL
          </label>
          <input
            id="product-image"
            type="url"
            defaultValue={product?.image || ''}
            disabled
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="product-description"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Description
        </label>
        <textarea
          id="product-description"
          rows={4}
          {...register('description')}
          placeholder="Enter product description (optional)"
          className={`w-full px-4 py-2.5 border rounded-lg text-sm resize-vertical
            focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
            transition-all duration-200
            ${errors.description ? 'border-red-400' : 'border-slate-300'}
          `}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>
    </form>
  );
};

export default BasicInfoForm;
