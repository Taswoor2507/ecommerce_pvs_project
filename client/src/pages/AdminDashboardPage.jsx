import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  MoreHorizontal,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import Button from '../components/ui/Button.jsx';

const AdminDashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock data - in real app, this would come from API
  const stats = {
    revenue: {
      value: '$48,574',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'emerald'
    },
    orders: {
      value: '1,429',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'blue'
    },
    customers: {
      value: '3,842',
      change: '+5.7%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    },
    products: {
      value: '248',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
      color: 'orange'
    }
  };

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', amount: '$125.00', status: 'completed', date: '2 hours ago' },
    { id: '#12346', customer: 'Jane Smith', amount: '$89.50', status: 'processing', date: '3 hours ago' },
    { id: '#12347', customer: 'Bob Johnson', amount: '$210.00', status: 'pending', date: '5 hours ago' },
    { id: '#12348', customer: 'Alice Brown', amount: '$156.75', status: 'completed', date: '6 hours ago' },
  ];

  const topProducts = [
    { name: 'Premium Headphones', sales: 145, revenue: '$14,500', trend: '+12%' },
    { name: 'Wireless Mouse', sales: 98, revenue: '$4,900', trend: '+8%' },
    { name: 'USB-C Hub', sales: 87, revenue: '$8,700', trend: '+15%' },
    { name: 'Mechanical Keyboard', sales: 76, revenue: '$7,600', trend: '-3%' },
  ];

  const quickActions = [
    { title: 'Create Product', description: 'Add a new product to inventory', icon: Package, color: 'blue', action: '/admin/products/create' },
    { title: 'View Orders', description: 'Manage customer orders', icon: ShoppingCart, color: 'emerald', action: '/admin/orders' },
    { title: 'Add Customer', description: 'Register a new customer', icon: Users, color: 'purple', action: '/admin/customers' },
    { title: 'Analytics', description: 'View detailed reports', icon: TrendingUp, color: 'orange', action: '/admin/analytics' },
  ];

  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    const isPositive = stat.trend === 'up';
    
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <div>
              <p className="text-sm text-slate-600 font-medium">{stat.icon.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-sm font-semibold ${
            isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{stat.change}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(stats).map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-2xl border border-blue-200/60 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-4 hover:shadow-lg transition-all duration-300 group text-left"
              >
                <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 text-${action.color}-600`} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg">
          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{order.id}</p>
                      <p className="text-sm text-slate-600">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{order.amount}</p>
                    <div className="flex items-center justify-end space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-slate-500">{order.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg">
          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Top Products</h2>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-600">{product.sales} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{product.revenue}</p>
                    <span className={`text-sm font-semibold ${
                      product.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {product.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart Placeholder */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Sales Overview</h2>
          <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">Sales chart will be displayed here</p>
              <p className="text-sm text-slate-500 mt-1">Integration with chart library needed</p>
            </div>
          </div>
        </div>

        {/* Customer Growth Chart Placeholder */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Customer Growth</h2>
          <div className="h-64 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">Customer growth chart will be displayed here</p>
              <p className="text-sm text-slate-500 mt-1">Integration with chart library needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
