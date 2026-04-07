import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb - A reusable navigation breadcrumb component
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of { label: string, to?: string, onClick?: () => void }
 * @param {string} props.separator - 'chevron' | 'slash' | 'dot'
 */
const Breadcrumb = ({
  items,
  separator = 'chevron',
  className = '',
}) => {
  const separators = {
    chevron: <ChevronRight className="w-4 h-4 text-gray-400" />,
    slash: <span className="text-gray-400">/</span>,
    dot: <span className="text-gray-400">•</span>,
  };

  const renderItem = (item, index) => {
    const isLast = index === items.length - 1;
    
    const content = (
      <span className={`
        text-sm 
        ${isLast 
          ? 'text-gray-900 font-medium truncate max-w-xs' 
          : 'text-gray-500 hover:text-indigo-600 transition-colors'
        }
      `}>
        {item.label}
      </span>
    );

    if (isLast) {
      return (
        <span key={index} aria-current="page">
          {content}
        </span>
      );
    }

    if (item.to) {
      return (
        <Link 
          key={index} 
          to={item.to}
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          {item.label}
        </Link>
      );
    }

    if (item.onClick) {
      return (
        <button
          key={index}
          onClick={item.onClick}
          className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          {item.label}
        </button>
      );
    }

    return <span key={index}>{content}</span>;
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && separators[separator]}
            {renderItem(item, index)}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
