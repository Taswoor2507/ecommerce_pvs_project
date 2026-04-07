import { createBrowserRouter, Navigate } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CreateProductPage from "./pages/CreateProductPage";
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminProductViewPage from "./pages/AdminProductViewPage";
import AdminProductEditPage from "./pages/AdminProductEditPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";

// Router
export const router = createBrowserRouter([
  // Admin Routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: "products",
        element: <AdminProductsPage />,
      },
      {
        path: "products/create",
        element: <CreateProductPage />,
      },
      {
        path: "products/:id",
        element: <AdminProductViewPage />,
      },
      {
        path: "products/:id/edit",
        element: <AdminProductEditPage />,
      },
      {
        path: "orders",
        element: <AdminOrdersPage />,
      },
      {
        path: "customers",
        element: <div className="p-6"><h1 className="text-2xl font-bold">Customers</h1><p className="text-slate-600 mt-2">Customer management page coming soon...</p></div>,
      },
      {
        path: "analytics",
        element: <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p className="text-slate-600 mt-2">Analytics dashboard coming soon...</p></div>,
      },
      {
        path: "settings",
        element: <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-slate-600 mt-2">Settings page coming soon...</p></div>,
      },
    ],
  },

  // Customer Routes
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      {
        index: true, 
        element: <ProductListPage />,
      },
      {
        path: "products",
        element: <ProductListPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
    ],
  },

  // Fallback (404 → redirect)
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);