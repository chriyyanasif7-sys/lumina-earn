import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { doc, onSnapshot, collection, addDoc, increment, updateDoc } from 'firebase/firestore';
import { Wallet, ArrowDownCircle, CheckCircle2, AlertTriangle, Smartphone } from 'lucide-react';

function Withdraw() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [amount, setAmount] = useState(''); // Points to withdraw
  const [method, setMethod] = useState('Easypaisa');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Real-time wallet balance fetch karna
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setPoints(docSnap.data().points || 0);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const pointsToDeduct = parseInt(amount);

    // Business Rules Validations
    if (isNaN(pointsToDeduct) || pointsToDeduct < 1000) {
      setMessage({ type: 'error', text: 'Minimum withdrawal is 1000 Points (Rs. 100).' });
      return;
    }

    if (pointsToDeduct > points) {
      setMessage({ type: 'error', text: 'Insufficient balance in your wallet.' });
      return;
    }

    if (accountNumber.length < 10) {
      setMessage({ type: 'error', text: 'Please enter a valid mobile account number.' });
      return;
    }

    try {
      setLoading(true);
      
      // 1. Withdrawals collection mein naya record banana
      await addDoc(collection(db, "withdrawals"), {
        uid: user.uid,
        userEmail: user.email,
        points: pointsToDeduct,
        rupees: pointsToDeduct / 10, // 1000 Pts = Rs. 100
        method: method,
        accountNumber: accountNumber,
        accountName: accountName,
        status: "Pending", // Awaiting Admin Approval
        createdAt: new Date().toISOString()
      });

      // 2. User ke wallet se points usi waqt minus (deduct) karna
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        points: increment(-pointsToDeduct)
      });

      setMessage({ type: 'success', text: `Request submitted! Rs. ${pointsToDeduct / 10} will be sent after admin verification.` });
      setAmount('');
      setAccountNumber('');
      setAccountName('');
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Transaction failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 space-y-6 px-4">
      {/* Balance display widget */}
      <div className="bg-gradient-to-br from-[#111827] to-purple-950/30 border border-gray-800 p-6 rounded-3xl text-center relative overflow-hidden">
        <Wallet className="h-12 w-12 text-purple-500 mx-auto mb-2 opacity-80" />
        <p className="text-xs text-gray-400 uppercase tracking-wider">Available Balance</p>
        <p className="text-3xl font-black text-white mt-1">{points} <span className="text-sm font-normal text-gray-500">Pts</span></p>
        <p className="text-emerald-400 text-xs font-medium mt-1">Est. Value: Rs. {(points / 10).toFixed(2)}</p>
      </div>

      {/* Cashout form */}
      <div className="bg-[#111827] border border-gray-800 p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ArrowDownCircle className="h-5 w-5 text-purple-400" />
          Local Cashout Option
        </h2>
        <p className="text-xs text-gray-400 mt-1">Convert your coins directly to local mobile wallets.</p>

        {message.text && (
          <div className={`mt-4 p-3 rounded-xl border text-sm flex items-start gap-2 ${
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 flex-shrink-0" />}
            <p>{message.text}</p>
          </div>
        )}

        <form onSubmit={handleWithdrawSubmit} className="mt-6 space-y-4">
          {/* Method Selection */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Select Provider</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button" onClick={() => setMethod('Easypaisa')}
                className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                  method === 'Easypaisa' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/10' : 'bg-[#0b0f19] border-gray-800 text-gray-400'
                }`}
              >
                Easypaisa
              </button>
              <button
                type="button" onClick={() => setMethod('JazzCash')}
                className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                  method === 'JazzCash' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/10' : 'bg-[#0b0f19] border-gray-800 text-gray-400'
                }`}
              >
                JazzCash
              </button>
            </div>
          </div>

          {/* Points Amount */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Points to Redeem</label>
            <input
              type="number" required min="1000" step="100" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum 1000"
              className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-3 px-4 text-gray-200 placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
            />
            {amount && <p className="text-xs text-purple-400 mt-1.5 font-medium">You will get: Rs. {parseInt(amount) ? (parseInt(amount) / 10).toFixed(0) : 0}</p>}
          </div>

          {/* Account Number */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Mobile Account Number</label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              <input
                type="tel" required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="03xxxxxxxxx"
                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-200 placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Account Title Holder Name */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Account Title (Name)</label>
            <input
              type="text" required value={accountName} onChange={(e) => setAccountName(e.target.value)}
              placeholder="Account holder full name"
              className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl py-3 px-4 text-gray-200 placeholder-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl mt-6 shadow-lg shadow-purple-600/20 hover:opacity-90 disabled:opacity-50 transition-all text-sm"
          >
            {loading ? 'Processing transaction...' : 'Submit Payout Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Withdraw;
