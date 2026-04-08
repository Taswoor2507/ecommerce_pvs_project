import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit,
  Trash2,
  Package,
  DollarSign,
  Box,
  Star,
  Copy,
} from 'lucide-react';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { Tabs, TabPanel } from '../components/ui/Tabs';
import { Card, CardTitle } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import DataTable from '../components/ui/DataTable';
import { useProductDetail } from '../hooks/useProductDetail';
import { useProducts } from '../hooks/useProducts';
import toast from 'react-hot-toast';

const StatCard = ({ label, icon: Icon, iconBg, iconColor, children }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <div className="mt-2">{children}</div>
      </div>
      <div
        className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  </Card>
);

const AdminProductViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const { product, combinations, isLoading, isError, error } =
    useProductDetail(id);
  const { deleteProduct, isDeleting } = useProducts();

  const handleDeleteProduct = async () => {
    await deleteProduct(id);
    navigate('/admin/products');
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(product?._id || product?.id);
    toast.success('Product ID copied');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        <p className="ml-3 text-slate-500">Loading product…</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          icon={Package}
          title="Product Not Found"
          description={
            error?.message || "This product may have been deleted or doesn't exist."
          }
          action={
            <Button onClick={() => navigate('/admin/products')}>
              Back to Products
            </Button>
          }
        />
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'combinations', label: 'Combinations', count: combinations.length },
  ];

  const combinationColumns = [
    {
      key: 'variant',
      title: 'Variant',
      render: (_, row) => (
        <div className="flex flex-wrap gap-1.5">
          {row.option_labels?.map((label, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
            >
              <span className="text-slate-400 mr-1">{label.type}:</span>
              {label.value}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'stock',
      title: 'Stock',
      render: (val) => (
        <span
          className={`text-sm font-semibold ${
            val === 0
              ? 'text-red-600'
              : val < 10
              ? 'text-amber-600'
              : 'text-emerald-600'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'final_price',
      title: 'Price',
      render: (val) => (
        <span className="text-sm text-slate-900">
          ${(val ?? 0).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, row) => <StatusBadge type="stock" value={row.stock} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        subtitle={`Product ID: ${product._id || product.id}`}
        backTo="/admin/products"
        backLabel="Back"
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={handleCopyId}>
              <Copy className="w-4 h-4 mr-2" />
              Copy ID
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/admin/products/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Status"
          icon={Package}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        >
          <StatusBadge type="status" value={product.is_active ? 'active' : 'inactive'} />
        </StatCard>

        <StatCard
          label="Base Price"
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        >
          <p className="text-2xl font-bold text-slate-900">
            ${product.base_price || '0.00'}
          </p>
        </StatCard>

        <StatCard
          label="Total Stock"
          icon={Box}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        >
          <StatusBadge type="stock" value={product.total_stock || product.stock || 0} />
        </StatCard>

        <StatCard
          label="Rating"
          icon={Star}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        >
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span className="text-lg font-semibold text-slate-900">
              {product.rating || '0.0'}
            </span>
          </div>
        </StatCard>
      </div>

      <Card padding={false}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-6">
          <TabPanel id="details" activeTab={activeTab}>
            <div className="space-y-6">
              <div>
                <CardTitle>Product Information</CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <InfoField label="Name" value={product.name} />
                  <InfoField label="SKU" value={product.sku || 'N/A'} />
                  <InfoField
                    label="Category"
                    value={product.category || 'Uncategorized'}
                  />
                  <InfoField
                    label="Base Price"
                    value={`$${product.base_price || '0.00'}`}
                  />
                </div>
              </div>

              {product.description && (
                <div>
                  <CardTitle>Description</CardTitle>
                  <p className="text-slate-600 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {product.variant_types?.length > 0 && (
                <div>
                  <CardTitle>Variant Types</CardTitle>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {product.variant_types.map((vt) => (
                      <div
                        key={vt._id}
                        className="border border-slate-200 rounded-lg px-4 py-2"
                      >
                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                          {vt.name}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {vt.options?.map((opt) => (
                            <span
                              key={opt._id}
                              className="px-2 py-0.5 text-xs bg-slate-100 rounded-md text-slate-700"
                            >
                              {opt.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabPanel>

          <TabPanel id="combinations" activeTab={activeTab}>
            <CardTitle className="mb-4">
              Product Variants ({combinations.length})
            </CardTitle>
            <DataTable
              columns={combinationColumns}
              data={combinations}
              emptyState={
                <EmptyState
                  icon={Package}
                  title="No variants"
                  description="This product has no variant combinations"
                />
              }
            />
          </TabPanel>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProduct}
        title={`Delete "${product.name}"?`}
        message="This action cannot be undone. This will permanently delete the product and all its variants."
        confirmLabel="Delete Product"
        isLoading={isDeleting}
      />
    </div>
  );
};

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-sm text-slate-900">{value}</p>
  </div>
);

export default AdminProductViewPage;
