import { Link } from 'react-router-dom';
import { Store, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CartIcon from './CartIcon';
import Button from './ui/Button';

const Header = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-gray-900 hover:text-indigo-600 transition-all duration-300 group"
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform shadow-indigo-200 shadow-md">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">ECommerce</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium text-sm"
            >
              Home
            </Link>
            <Link 
              to="/products"
              className="text-gray-600 hover:text-indigo-600 transition-colors font-medium text-sm"
            >
              Products
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link 
                to="/admin"
                className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors font-semibold text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <CartIcon />
            
            <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block" />

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-sm font-semibold text-gray-900 leading-none">{user?.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                    </div>
                    
                    <div className="group relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-white cursor-pointer hover:rotate-3 shadow-indigo-100 transition-all">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Dropdown would go here if needed, keeping it simple for now with a direct Logout button */}
                    </div>

                    <button
                      onClick={logout}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button variant="primary" size="sm" className="px-6 rounded-xl">
                      Sign In
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
