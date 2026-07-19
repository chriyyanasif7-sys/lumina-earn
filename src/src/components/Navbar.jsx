import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Coins, LogIn, UserPlus, LogOut, LayoutDashboard, ArrowDownCircle, ShieldCheck } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current logged-in user is admin
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    const checkRole = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().role === 'admin') {
        setIsAdmin(true);
      }
    };
    checkRole();
  }, [user]);

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
            {/* Conditional Admin Panel Link */}
            {isAdmin && (
              <Link to="/admin" className="text-red-400 hover:text-red-300 flex items-center space-x-1 text-sm font-bold transition-colors bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}

            <Link to="/dashboard" className="text-gray-400 hover:text-purple-400 flex items-center space-x-1 text-sm font-medium transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link to="/withdraw" className="text-gray-400 hover:text-emerald-400 flex items-center space-x-1 text-sm font-medium transition-colors">
              <ArrowDownCircle className="h-4 w-4" />
              <span>Cashout</span>
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
