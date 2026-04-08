import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, Package, Info, Layers } from 'lucide-react';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import { Tabs, TabPanel } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import BasicInfoForm from '../components/product/edit/BasicInfoForm';
import VariantsTab from '../components/product/edit/VariantsTab';
import { useProductDetail } from '../hooks/useProductDetail';
import { useVariantMutation } from '../hooks/useVariantMutation';
import { productsApi } from '../api/products.api';
import toast from 'react-hot-toast';

const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);

  const { product, combinations, isLoading, isError, error } =
    useProductDetail(id);

  const variantMutation = useVariantMutation(id);

  const handleSaveBasicInfo = async (formData) => {
    setIsSaving(true);
    try {
      await productsApi.update(id, {
        name: formData.name,
        description: formData.description,
        base_price: parseFloat(formData.base_price),
        image: formData.image,
        stock: parseInt(formData.stock) || 0,
        is_active: formData.is_active,
      });
      toast.success('Product updated successfully');
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || 'Failed to update product';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
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
    { id: 'basic', label: 'Basic Information', icon: Info },
    {
      id: 'variants',
      label: 'Variants & Combinations',
      icon: Layers,
      count: combinations?.length || 0,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Product"
        subtitle={`ID: ${product._id || product.id}`}
        backTo={`/admin/products/${id}`}
        backLabel="Back to Product"
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/admin/products/${id}`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            {activeTab === 'basic' && (
              <Button
                type="submit"
                form="product-basic-form"
                isLoading={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </>
        }
      />

      <Card padding={false}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-6">
          <TabPanel id="basic" activeTab={activeTab}>
            <BasicInfoForm
              product={product}
              onSubmit={handleSaveBasicInfo}
              isSubmitting={isSaving}
            />
          </TabPanel>

          <TabPanel id="variants" activeTab={activeTab}>
            <VariantsTab
              product={product}
              combinations={combinations}
              variantMutation={variantMutation}
            />
          </TabPanel>
        </div>
      </Card>
    </div>
  );
};

export default AdminProductEditPage;