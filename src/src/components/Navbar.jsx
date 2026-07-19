import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Coins, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#111827]/80 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
          <Coins className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent">
          Lumina<span className="text-purple-500">Earn</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-400 hover:text-purple-400 flex items-center space-x-1 text-sm font-medium transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/tasks" className="text-gray-400 hover:text-purple-400 flex items-center space-x-1 text-sm font-medium transition-colors">
  <CheckCircle className="h-4 w-4" />
  <span>Tasks</span>
</Link>
            <button 
              onClick={logout}
              className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50 text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-800/50 text-sm font-medium">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>
            <Link to="/register" className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-600/20 text-sm">
              <UserPlus className="h-4 w-4" />
              <span>Join Now</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
