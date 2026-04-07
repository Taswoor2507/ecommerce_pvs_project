import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  ChevronDown,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Plus,
  TrendingUp,
  DollarSign,
  Box,
  Tag,
  FileText,
  HelpCircle
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items configuration
  const navigationItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      badge: null
    },
    {
      title: 'Products',
      icon: Package,
      path: '/admin/products',
      badge: 'New',
      children: [
        { title: 'All Products', path: '/admin/products' },
        { title: 'Create Product', path: '/admin/products/create' },
        { title: 'Categories', path: '/admin/categories' },
        { title: 'Inventory', path: '/admin/inventory' }
      ]
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      path: '/admin/orders',
      badge: '12',
      children: [
        { title: 'All Orders', path: '/admin/orders' },
        { title: 'Pending', path: '/admin/orders?status=pending' },
        { title: 'Processing', path: '/admin/orders?status=processing' },
        { title: 'Completed', path: '/admin/orders?status=completed' }
      ]
    },
    {
      title: 'Customers',
      icon: Users,
      path: '/admin/customers',
      children: [
        { title: 'All Customers', path: '/admin/customers' },
        { title: 'Customer Groups', path: '/admin/customer-groups' }
      ]
    },
    {
      title: 'Analytics',
      icon: TrendingUp,
      path: '/admin/analytics',
      children: [
        { title: 'Overview', path: '/admin/analytics' },
        { title: 'Sales Report', path: '/admin/analytics/sales' },
        { title: 'Product Performance', path: '/admin/analytics/products' },
        { title: 'Customer Insights', path: '/admin/analytics/customers' }
      ]
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      children: [
        { title: 'General', path: '/admin/settings' },
        { title: 'Payment', path: '/admin/settings/payment' },
        { title: 'Shipping', path: '/admin/settings/shipping' },
        { title: 'Taxes', path: '/admin/settings/taxes' }
      ]
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
        fixed top-0 left-0 z-50 w-72 h-screen bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${sidebarOpen ? 'w-72' : 'w-20'} md:w-72
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/60 bg-white/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className={`font-bold text-xl text-slate-900 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200/60">
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNavigationItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedSections[item.title];
            const hasChildren = item.children && item.children.length > 0;
            const isItemActive = isActive(item.path);

            return (
              <div key={item.title}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleSection(item.title);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isItemActive 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm shadow-blue-500/10 border border-blue-200/60' 
                      : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-5 h-5 flex items-center justify-center
                      ${isItemActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
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
                </button>

                {/* Submenu */}
                {hasChildren && isExpanded && (
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
        <div className="p-4 border-t border-slate-200/60 bg-white/50">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
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
                  {location.pathname === '/admin' && 'Dashboard'}
                  {location.pathname.startsWith('/admin/products') && 'Products'}
                  {location.pathname.startsWith('/admin/orders') && 'Orders'}
                  {location.pathname.startsWith('/admin/customers') && 'Customers'}
                  {location.pathname.startsWith('/admin/analytics') && 'Analytics'}
                  {location.pathname.startsWith('/admin/settings') && 'Settings'}
                </span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-900">Admin User</p>
                  <p className="text-xs text-slate-500">admin@example.com</p>
                </div>
              </div>
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
