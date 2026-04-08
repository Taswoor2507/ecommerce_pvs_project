import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Package, 
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
  LogOut,
  ChevronLeft,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Navigation items configuration
  const navigationItems = [
    {
      title: 'Products',
      icon: Package,
      path: '/admin/products',
      badge: null,
      children: [
        { title: 'All Products', path: '/admin/products' },
        { title: 'Create Product', path: '/admin/products/create' }
      ]
    },
    {
      title: 'Orders',
      icon: ShoppingBag,
      path: '/admin/orders',
      badge: null,
    }
  ];

  // Toggle section expansion
  const toggleSection = (title) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Check if current path matches navigation item
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  // Filter navigation items based on search
  const filteredNavigationItems = navigationItems.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(query) ||
           item.children?.some(child => child.title.toLowerCase().includes(query));
  });

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleMobileSidebar = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    handleMobileSidebar();
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen bg-white shadow-2xl transition-all duration-300 ease-in-out border-r border-slate-200
        ${sidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/60 bg-white/50">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
                <Package className="w-4 h-4 text-white" />
              </div>
              {sidebarOpen && (
                <span className="font-bold text-xl text-slate-900 truncate">
                  Product Admin
                </span>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            )}
          </div>
  
          {/* Search Bar */}
          {sidebarOpen && (
            <div className="p-4 border-b border-slate-200/60 transition-opacity">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          )}
  
          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto ${sidebarOpen ? 'p-4' : 'p-2'} space-y-2`}>
            {filteredNavigationItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedSections[item.title];
              const hasChildren = item.children && item.children.length > 0;
              const isItemActive = isActive(item.path);
  
              return (
                <div key={item.title}>
                  <button
                    onClick={() => {
                      if (hasChildren && sidebarOpen) {
                        toggleSection(item.title);
                      } else {
                        navigate(item.path);
                      }
                    }}
                    title={!sidebarOpen ? item.title : ''}
                    className={`
                      w-full flex items-center ${sidebarOpen ? 'justify-between px-4' : 'justify-center p-3'} py-3 rounded-xl transition-all duration-200 group
                      ${isItemActive 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm shadow-blue-500/10 border border-blue-200/60' 
                        : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-5 h-5 flex items-center justify-center flex-shrink-0
                        ${isItemActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {sidebarOpen && <span className="font-medium truncate">{item.title}</span>}
                    </div>
                    {sidebarOpen && (
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {hasChildren && (
                          isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </button>
  
                  {/* Submenu */}
                  {hasChildren && isExpanded && sidebarOpen && (
                    <div className="mt-2 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <button
                          key={child.path}
                          onClick={() => navigate(child.path)}
                          className={`
                            w-full flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm
                            ${location.pathname === child.path
                              ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }
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
        <div className={`p-4 border-t border-slate-200/60 bg-white/50 ${sidebarOpen ? 'space-y-3' : 'flex flex-col items-center'}`}>
          <Link 
            to="/"
            title="Back to Website"
            className={`flex items-center text-sm text-slate-600 hover:text-indigo-600 transition-colors ${sidebarOpen ? 'space-x-2 px-2' : 'justify-center'}`}
          >
            <ChevronLeft className={`w-4 h-4 ${!sidebarOpen && 'rotate-180 md:rotate-0'}`} />
            {sidebarOpen && <span>Back to Website</span>}
          </Link>
          {sidebarOpen && (
            <div className="text-center text-[10px] uppercase tracking-wider font-bold text-slate-400">
              v1.2.0 Management System
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 shadow-sm sticky top-0 z-30">
          <div className="h-full flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              
              {/* Breadcrumb */}
              <nav className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
                <span>Admin</span>
                <span>/</span>
                <span className="text-slate-900 font-medium">
                  {location.pathname.includes('/admin/orders') ? 'Orders' : 'Products'}
                </span>
              </nav>
            </div>

            <div className="flex items-center space-x-6">
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md shadow-indigo-200 border-2 border-white">
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{user?.role || 'Administrator'}</p>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <button
                onClick={logout}
                className="flex items-center space-x-2 p-2 px-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group font-medium text-sm"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
