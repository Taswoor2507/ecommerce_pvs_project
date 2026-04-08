const Card = ({ children, className = '', padding = true }) => {
  return (
    <div
      className={`
        bg-white/80 backdrop-blur-sm rounded-2xl
        border border-slate-200/60 shadow-lg
        ${padding ? 'p-6' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-slate-900 ${className}`}>
    {children}
  </h3>
);

export { Card, CardHeader, CardTitle };
export default Card;
