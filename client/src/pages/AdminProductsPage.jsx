import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Eye, Edit, Trash2, Package } from 'lucide-react';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import SearchInput from '../components/ui/SearchInput';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import Pagination from '../components/ui/Pagination';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Card from '../components/ui/Card';
import IconButton from '../components/ui/IconButton';
import { useProducts } from '../hooks/useProducts';

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    products,
    pagination,
    isLoading,
    isError,
    error,
    deleteProduct,
    isDeleting,
  } = useProducts({
    page: currentPage,
    limit: 10,
    search: searchQuery,
  });

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteProduct(deleteTarget._id || deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns = [
    {
      key: 'name',
      title: 'Product',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {row.image ? (
              <img
                src={row.image}
                alt={row.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {row.name || 'Untitled Product'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {row._id || row.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'variant_type_count',
      title: 'Variants',
      render: (val) => (
        <span className="text-sm text-slate-600">{val || 0} Types</span>
      ),
    },
    {
      key: 'base_price',
      title: 'Price',
      render: (val, row) => (
        <span className="text-sm font-semibold text-slate-900">
          ${val || row.price || '0.00'}
        </span>
      ),
    },
    {
      key: 'stock',
      title: 'Stock',
      render: (val, row) => {
        const stockVal = val ?? row.total_stock ?? 0;
        return <StatusBadge type="stock" value={stockVal} />;
      },
    },
    {
      key: 'actions',
      title: '',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (_, row) => {
        const id = row._id || row.id;
        return (
          <div className="flex items-center justify-end gap-1">
            <IconButton
              icon={Eye}
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/products/${id}`);
              }}
              ariaLabel="View product"
            />
            <IconButton
              icon={Edit}
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/products/${id}/edit`);
              }}
              ariaLabel="Edit product"
            />
            <IconButton
              icon={Trash2}
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(row);
              }}
              ariaLabel="Delete product"
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage your product inventory and variants"
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => navigate('/admin/products/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </>
        }
      />

      <Card>
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products by name…"
        />
      </Card>

      <Card padding={false}>
        <DataTable
          columns={columns}
          data={products}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRowClick={(row) =>
            navigate(`/admin/products/${row._id || row.id}`)
          }
          emptyState={
            <EmptyState
              icon={Package}
              title="No products found"
              description={
                searchQuery
                  ? `No products match "${searchQuery}"`
                  : 'Get started by adding your first product'
              }
              action={
                !searchQuery && (
                  <Button
                    size="sm"
                    onClick={() => navigate('/admin/products/create')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add your first product
                  </Button>
                )
              }
            />
          }
        />
      </Card>

      {!isLoading && !isError && pagination && pagination.pages > 1 && (
        <Pagination pagination={pagination} onPageChange={setCurrentPage} />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete "${deleteTarget?.name}"?`}
        message="This action cannot be undone. The product and all its variants will be permanently deleted."
        confirmLabel="Delete Product"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminProductsPage;
