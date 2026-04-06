import { Outlet} from "react-router-dom";
import { CartProvider } from "../contexts/CartContext";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

const MainLayout = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <Header />
        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
        
        {/* Cart Drawer */}
        <CartDrawer />
      </div>
    </CartProvider>
  );
};

export default MainLayout;
