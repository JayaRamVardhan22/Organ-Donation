import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { account, connectWallet, loading } = useWallet();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-teal-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-teal-200" />
              <span className="ml-2 text-xl font-bold">OrganChain</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-700">
                Home
              </Link>
              <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-700">
                Register
              </Link>
              <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-700">
                Dashboard
              </Link>
              <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-teal-700">
                About
              </Link>
              
              {account ? (
                <div className="px-3 py-2 rounded-md text-sm font-medium bg-teal-900">
                  {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-white text-teal-800 hover:bg-teal-100 transition-colors"
                >
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-200 hover:text-white hover:bg-teal-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-700"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/register"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-700"
              onClick={toggleMenu}
            >
              Register
            </Link>
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-700"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-700"
              onClick={toggleMenu}
            >
              About
            </Link>
            
            {account ? (
              <div className="px-3 py-2 rounded-md text-base font-medium bg-teal-900">
                {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
              </div>
            ) : (
              <button
                onClick={() => {
                  connectWallet();
                  toggleMenu();
                }}
                disabled={loading}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-white text-teal-800 hover:bg-teal-100 transition-colors"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;