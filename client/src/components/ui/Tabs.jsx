const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`border-b border-slate-200/60 ${className}`}>
      <nav className="flex space-x-1 px-6" aria-label="Tabs" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={`
                relative px-4 py-3 text-sm font-medium transition-colors duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-t-lg
                ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-slate-500 hover:text-slate-700'
                }
              `}
            >
              <span className="flex items-center gap-2">
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`
                      px-1.5 py-0.5 text-xs rounded-full
                      ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const TabPanel = ({ id, activeTab, children }) => {
  if (id !== activeTab) return null;
  return (
    <div role="tabpanel" id={`tabpanel-${id}`} aria-labelledby={id}>
      {children}
    </div>
  );
};

export { Tabs, TabPanel };
export default Tabs;
