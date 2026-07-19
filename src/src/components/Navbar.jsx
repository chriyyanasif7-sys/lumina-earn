import React from 'react';
import { Coins, LogIn, UserPlus } from 'lucide-react';

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#111827]/80 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2 cursor-pointer">
        <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-xl shadow-lg">
          <Coins className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-purple-400 bg-clip-text text-transparent">
          Lumina<span className="text-purple-500">Earn</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg">
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </button>
        <button className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity">
          <UserPlus className="h-4 w-4" />
          <span>Join Now</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
