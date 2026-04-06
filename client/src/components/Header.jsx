import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Store } from 'lucide-react'

const Header = () => {
  return (
     <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors"
            >
              <Store className="w-6 h-6" />
              <span className="text-xl font-bold">ECommerce</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                to="/products"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Products
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header
