import { createBrowserRouter, Navigate } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CreateProductPage from "./pages/CreateProductPage";
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/AdminLayout";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminProductViewPage from "./pages/AdminProductViewPage";
import AdminProductEditPage from "./pages/AdminProductEditPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";

// Router
export const router = createBrowserRouter([
  // Auth Routes
  {
    path: "/login",
    element: <AuthPage />,
  },
  
  // Admin Routes (Protected)
  {
    path: "/admin",
    element: <ProtectedRoute adminOnly={true} />,
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminProductsPage />,
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
        ]
      }
    ],
  },

  // Customer Routes (Public)
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
      {
        path: "checkout",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <CheckoutPage />,
          }
        ]
      },
      {
        path: "order-success",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <OrderSuccessPage />,
          }
        ]
      },
    ],
  },

  // Fallback (404 → redirect)
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);