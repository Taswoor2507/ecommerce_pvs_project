import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Package, 
  ChevronDown,
  ChevronRight,
  Search,
  LogOut,
  ChevronLeft,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Professional Admin Layout with industry-standard responsiveness.
 */
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Navigation Items
  const navigationItems = [
    {
      title: 'Products',
      icon: Package,
      path: '/admin/products',
      children: [
        { title: 'All Products', path: '/admin/products' },
        { title: 'Create Product', path: '/admin/products/create' }
      ]
    },
    {
      title: 'Orders',
      icon: ShoppingBag,
      path: '/admin/orders',
    }
  ];

  // Logic: Handle Responsive State
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Logic: Auto-close sidebar on mobile route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSection = (title) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const filteredItems = navigationItems.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) || 
           item.children?.some(c => c.title.toLowerCase().includes(q));
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
      
      {/* 1. SIDEBAR (Fixed Drawer on Mobile, Static Rail on Desktop) */}
      <div 
        className={`
          fixed inset-0 z-50 lg:relative lg:z-0
          ${sidebarOpen ? 'visible' : 'invisible lg:visible'}
        `}
      >
        {/* Backdrop for Mobile overlay */}
        <div 
          className={`
            absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden
            ${sidebarOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar Panel */}
        <aside 
          className={`
            relative h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
            ${sidebarOpen ? 'w-[280px] translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Logo / Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <span className="font-bold text-lg whitespace-nowrap tracking-tight">Admin Portal</span>
              )}
            </div>
            {isMobile && sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-900 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-6 px-3 space-y-1">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const expanded = expandedSections[item.title];
              const active = isActive(item.path);

              return (
                <div key={item.title} className="space-y-1">
                  <button
                    onClick={() => {
                      if (item.children && sidebarOpen) {
                        toggleSection(item.title);
                      } else {
                        navigate(item.path);
                      }
                    }}
                    className={`
                      w-full flex items-center ${sidebarOpen ? 'justify-between px-3' : 'justify-center'} py-2.5 rounded-xl transition-all
                      ${active 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                      {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.title}</span>}
                    </div>
                    {sidebarOpen && item.children && (
                      <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                    )}
                  </button>

                  {/* Submenu */}
                  {sidebarOpen && item.children && expanded && (
                    <div className="ml-9 space-y-1 py-1 border-l border-slate-100 pl-3">
                      {item.children.map(child => (
                        <button
                          key={child.path}
                          onClick={() => navigate(child.path)}
                          className={`
                            w-full text-left py-1.5 px-3 rounded-lg text-sm transition-colors
                            ${location.pathname === child.path 
                              ? 'text-indigo-600 font-bold bg-indigo-50' 
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                          `}
                        >
                          {child.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100 mt-auto">
            <Link 
              to="/"
              className={`flex items-center gap-3 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors ${!sidebarOpen && 'justify-center'}`}
            >
              <ChevronLeft className="w-4 h-4" />
              {sidebarOpen && <span>View Storefront</span>}
            </Link>
          </div>
        </aside>
      </div>

      {/* 2. MAIN VIEWPORT (Header + Content) */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex-shrink-0">
          <div className="h-full px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              
              <div className="text-sm font-semibold text-slate-600 hidden sm:flex items-center gap-2">
                <span className="opacity-50">Admin</span>
                <ChevronRight className="w-3 h-3 opacity-30" />
                <span className="text-slate-900 capitalize font-bold">
                  {location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
              <div className="flex items-center gap-3 pr-2 md:pr-6 md:border-r border-slate-100">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-100 border border-slate-200 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs md:text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{user?.role || 'Admin'}</p>
                </div>
              </div>

              <button 
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
