import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Wallet } from 'lucide-react';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl">
        Earn Rewards by Completing 
        <span className="bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent block mt-2">
          Simple Everyday Tasks
        </span>
      </h1>
      <p className="mt-6 text-gray-400 max-w-xl text-lg">
        Pakistan's premium rewards platform. Complete micro-tasks, watch ads, and fill surveys to cash out directly via JazzCash & Easypaisa.
      </p>
      
      <div className="mt-10">
        <button className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold px-8 py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform">
          <span>Start Earning Now</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full">
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl text-left">
          <Zap className="h-8 w-8 text-purple-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Instant Tasks</h3>
          <p className="text-gray-400 text-sm">Watch short ads, complete daily check-ins, or take high-paying surveys anytime.</p>
        </div>
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl text-left">
          <Wallet className="h-8 w-8 text-indigo-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Local Payouts</h3>
          <p className="text-gray-400 text-sm">Convert 1000 points into Rs.100 and withdraw easily via Easypaisa or JazzCash.</p>
        </div>
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl text-left">
          <ShieldCheck className="h-8 w-8 text-emerald-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">100% Sustainable</h3>
          <p className="text-gray-400 text-sm">No fake promises. Real revenue generated from verified corporate advertising partners.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
