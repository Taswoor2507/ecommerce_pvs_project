import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../ui/Button';

const AddOptionInline = ({ onSubmit, isSubmitting = false }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      setError('Option value is required');
      return;
    }
    if (trimmed.length > 100) {
      setError('Option must be less than 100 characters');
      return;
    }

    setError('');
    await onSubmit(trimmed);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2 pt-2 border-t border-slate-100">
      <div className="flex-1">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError('');
          }}
          placeholder="Type an option..."
          className={`w-full px-3 py-2 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
            transition-all duration-200
            ${error ? 'border-red-400' : 'border-slate-300'}
          `}
          disabled={isSubmitting}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <Button 
        type="submit" 
        size="sm" 
        variant="secondary"
        isLoading={isSubmitting}
        className="px-4"
      >
        <Plus className="w-3.5 h-3.5 mr-1" />
        Add
      </Button>
    </form>
  );
};

export default AddOptionInline;
