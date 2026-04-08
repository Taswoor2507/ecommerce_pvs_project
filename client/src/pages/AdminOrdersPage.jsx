import { useState } from 'react';
import { ShoppingBag, Eye, Calendar, User, DollarSign } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Pagination from '../components/ui/Pagination';
import Card from '../components/ui/Card';
import IconButton from '../components/ui/IconButton';
import EmptyState from '../components/ui/EmptyState';
import { useOrders } from '../hooks/useOrders';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';

const AdminOrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (id) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  const {
    orders,
    pagination,
    isLoading,
    isError,
    error,
  } = useOrders({
    page: currentPage,
    limit: 10,
    status: statusFilter,
  });

  const columns = [
    {
      key: 'order_id',
      title: 'Order Details',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {row.product_snapshot?.name || 'Unknown Product'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              ID: {row._id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'user',
      title: 'Customer',
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700">
            {row.user_id?.name || 'Guest User'}
          </span>
          <span className="text-xs text-slate-400">
            {row.user_id?.email || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      title: 'Date',
      render: (val) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-sm">
            {new Date(val).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: 'total_price',
      title: 'Total',
      render: (val) => (
        <span className="text-sm font-bold text-slate-900">
          ${val.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (val) => <StatusBadge type="status" value={val} />,
    },
    {
      key: 'actions',
      title: '',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (_, row) => (
        <IconButton
          icon={Eye}
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(row._id)}
          ariaLabel="View order details"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Manage and track customer orders"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Total Orders" 
          value={pagination?.total || 0} 
          icon={ShoppingBag}
          color="indigo"
        />
        <StatCard 
          label="Active Customers" 
          value={new Set(orders.map(o => o.user_id?._id)).size} 
          icon={User}
          color="blue"
        />
        <StatCard 
          label="Total Revenue" 
          value={`$${orders.reduce((sum, o) => sum + o.total_price, 0).toFixed(2)}`} 
          icon={DollarSign}
          color="emerald"
        />
      </div>

      <Card padding={false}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Recent Orders</h3>
          <select 
            className="text-sm border-slate-200 rounded-lg focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          isError={isError}
          error={error}
          emptyState={
            <EmptyState
              icon={ShoppingBag}
              title="No orders found"
              description="When customers place orders, they will appear here."
            />
          }
        />
      </Card>

      {!isLoading && !isError && pagination && pagination.pages > 1 && (
        <Pagination 
          pagination={pagination} 
          onPageChange={setCurrentPage} 
        />
      )}

      <OrderDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        orderId={selectedOrderId} 
      />
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default AdminOrdersPage;
