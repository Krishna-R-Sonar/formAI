// File: formAI/frontend/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsBlurred(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isBlurred ? 'backdrop-blur-md bg-white/90 shadow-lg border-b border-gray-100' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
              FormAI
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
              Home
            </Link>
            {token ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                  Dashboard
                </Link>
                <Link to="/settings" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {token ? (
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
