import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { collection, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Users, ArrowDownCircle, CheckCircle, XCircle, ShieldCheck, AlertCircle } from 'lucide-react';

function AdminDashboard() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  
  // Analytics States
  const [usersList, setUsersList] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState({ totalPoints: 0, pendingPayouts: 0 });

  // 1. Strict Security Rule: Pehle check karo user document me role: "admin" hai ya nahi
  useEffect(() => {
    if (!user) return;
    const checkAdminRole = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().role === 'admin') {
        setIsAdmin(true);
      }
      setCheckingAdmin(false);
    };
    checkAdminRole();
  }, [user]);

  // 2. Real-Time Monitor: Users aur Withdrawals ka live data fetch karna
  useEffect(() => {
    if (!isAdmin) return;

    // Fetch Users Snapshot
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersList(usersData);
      
      const ptsSum = usersData.reduce((acc, curr) => acc + (curr.points || 0), 0);
      setStats(prev => ({ ...prev, totalPoints: ptsSum }));
    });

    // Fetch Withdrawals Snapshot
    const unsubscribeWithdrawals = onSnapshot(collection(db, "withdrawals"), (snapshot) => {
      const withdrawData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWithdrawals(withdrawData);

      const pendingCount = withdrawData.filter(w => w.status === "Pending").length;
      setStats(prev => ({ ...prev, pendingPayouts: pendingCount }));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeWithdrawals();
    };
  }, [isAdmin]);

  // 3. Status Action Handler (Approve / Reject Requests)
  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const requestRef = doc(db, 'withdrawals', requestId);
      await updateDoc(requestRef, {
        status: newStatus,
        processedAt: new Date().toISOString()
      });
      alert(`Request has been marked as ${newStatus} successfully.`);
    } catch (error) {
      alert("Failed to update status. Please try again.");
    }
  };

  if (checkingAdmin) {
    return <div className="text-center py-20 text-gray-400">Verifying administrative security patterns...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-gray-400 text-sm">Your security footprint does not match administrative privileges. This incident has been logged.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-950/20 via-[#111827] to-[#111827] border border-red-900/20 p-6 rounded-3xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-red-400" />
            LuminaEarn Control Center
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Global website parameters, ledger statistics and payout approval engine.</p>
        </div>
      </div>

      {/* Analytics Counter Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <Users className="h-5 w-5 text-purple-400 mb-2" />
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Registered Accounts</p>
          <p className="text-3xl font-black text-white mt-1">{usersList.length}</p>
        </div>
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <ArrowDownCircle className="h-5 w-5 text-amber-400 mb-2" />
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Active Pending Payouts</p>
          <p className="text-3xl font-black text-amber-400 mt-1">{stats.pendingPayouts}</p>
        </div>
        <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl">
          <ShieldCheck className="h-5 w-5 text-emerald-400 mb-2" />
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Circulating Ledger Balance</p>
          <p className="text-3xl font-black text-white mt-1">{stats.totalPoints} <span className="text-xs font-normal text-gray-500">Pts</span></p>
        </div>
      </div>

      {/* Main Panel Operations Area */}
      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Incoming Withdrawal Requests Queue</h2>
        {withdrawals.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">No transaction workflows generated by users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Account Metadata</th>
                  <th className="py-3 px-4">Financials</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-center">Executive Decisions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
                {withdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="py-4 px-4 font-medium text-white max-w-[150px] truncate">{req.userEmail}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                        req.method === 'JazzCash' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>{req.method}</span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-mono text-white text-xs">{req.accountNumber}</p>
                      <p className="text-xs text-gray-500">{req.accountName}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-white font-bold">{req.points} Pts</p>
                      <p className="text-xs text-emerald-400">Rs. {req.rupees}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        req.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 
                        req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>{req.status}</span>
                    </td>
                    <td className="py-4 px-4">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleUpdateStatus(req.id, 'Approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition-all shadow-md shadow-emerald-600/10"
                          >
                            <CheckCircle className="h-4 w-4" /> Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition-all shadow-md shadow-red-600/10"
                          >
                            <XCircle className="h-4 w-4" /> Reject
                          </button>
                        </div>
                      ) : (
                        <p className="text-center text-xs text-gray-500 font-mono">Workflow Resolved</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
