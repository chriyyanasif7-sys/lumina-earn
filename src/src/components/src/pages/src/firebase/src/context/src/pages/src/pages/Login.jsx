import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      alert('Logged in successfully!');
    } catch (err) {
      setError(err.message || 'Failed to sign in.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-[#111827] border border-gray-800 p-8 rounded-3xl max-w-md w-full shadow-2xl shadow-purple-950/10 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-center text-gray-400 text-sm mt-2">Sign in to manage your rewards</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mt-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" 
                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full group flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl mt-6 shadow-lg shadow-purple-600/20 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <span>{loading ? 'Signing In...' : 'Login'}</span>
            {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
