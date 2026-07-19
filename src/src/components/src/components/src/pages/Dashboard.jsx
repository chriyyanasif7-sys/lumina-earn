import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, Award, Clock, ArrowUpRight, CheckCircle2, PlayCircle, ClipboardList } from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();

  // Temporary dummy data jab tak database connect nahi hota poori tarah
  const userStats = {
    points: 0,
    lifetimeEarnings: 0,
    pendingWithdrawals: 0
  };

  return (
    <div className="space-y-8 py-6">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-purple-950/20 via-[#111827] to-[#111827] border border-gray-800 p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Welcome back, <span className="text-purple-400">{user?.email?.split('@')[0] || 'User'}</span>! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Ready to complete tasks and earn rewards today?</p>
        </div>
        <div className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-xl font-medium w-fit">
          1000 Points = Rs.100
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Points */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="h-24 w-24 text-purple-500" />
          </div>
          <div className="flex items-center space-x-3 text-purple-400 mb-2">
            <Wallet className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Current Balance</span>
          </div>
          <div className="text-3xl font-black text-white">{userStats.points} <span className="text-sm font-normal text-gray-500">Pts</span></div>
          <p className="text-gray-500 text-xs mt-2">Value: Rs. {(userStats.points / 10).toFixed(2)}</p>
        </div>

        {/* Lifetime Earnings */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award className="h-24 w-24 text-indigo-500" />
          </div>
          <div className="flex items-center space-x-3 text-indigo-400 mb-2">
            <Award className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Lifetime Earnings</span>
          </div>
          <div className="text-3xl font-black text-white">{userStats.lifetimeEarnings} <span className="text-sm font-normal text-gray-500">Pts</span></div>
          <p className="text-gray-500 text-xs mt-2">Total cash earned till now</p>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="h-24 w-24 text-amber-500" />
          </div>
          <div className="flex items-center space-x-3 text-amber-400 mb-2">
            <Clock className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Cashout</span>
          </div>
          <div className="text-3xl font-black text-white">{userStats.pendingWithdrawals} <span className="text-sm font-normal text-gray-500">Pts</span></div>
          <p className="text-gray-500 text-xs mt-2">Awaiting admin approval</p>
        </div>
      </div>

      {/* Quick Actions / Micro Tasks Section */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quick Earning Tasks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-[#0b0f19] border border-gray-800 rounded-xl flex items-center justify-between hover:border-purple-500/50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-white">Daily Check-In</p>
                <p className="text-xs text-gray-500">+20 Pts • Once a day</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-500" />
          </div>

          <div className="p-4 bg-[#0b0f19] border border-gray-800 rounded-xl flex items-center justify-between hover:border-indigo-500/50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <PlayCircle className="h-5 w-5 text-indigo-400" />
              <div>
                <p className="text-sm font-medium text-white">Watch Video Ads</p>
                <p className="text-xs text-gray-500">Instant rewards</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-500" />
          </div>

          <div className="p-4 bg-[#0b0f19] border border-gray-800 rounded-xl flex items-center justify-between hover:border-emerald-500/50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <ClipboardList className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Surveys & Offers</p>
                <p className="text-xs text-gray-500">High paying tasks</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
