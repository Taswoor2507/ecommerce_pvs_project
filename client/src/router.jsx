import { createBrowserRouter, Navigate } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import MainLayout from "./components/MainLayout";

// Router
export const router = createBrowserRouter([
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