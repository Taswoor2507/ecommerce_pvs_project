import EmptyState from './EmptyState';
import { Loader2 } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  isLoading,
  isError,
  error,
  emptyState,
  onRowClick,
  rowKey = '_id',
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        <span className="ml-3 text-sm text-slate-500">Loading…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Something went wrong"
        description={error?.message || 'Failed to load data. Please try again.'}
      />
    );
  }

  if (!data?.length) {
    return emptyState || <EmptyState />;
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200/60 bg-slate-50/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
                  px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider
                  ${col.headerClassName || ''}
                `}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, rowIndex) => (
            <tr
              key={row[rowKey] || rowIndex}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`
                transition-colors duration-150
                ${onRowClick ? 'cursor-pointer hover:bg-indigo-50/40' : 'hover:bg-slate-50/60'}
              `}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-5 py-3.5 text-sm ${col.cellClassName || ''}`}
                >
                  {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
