import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { CalendarCheck, Play, ClipboardList, ShieldAlert, CheckCircle } from 'lucide-react';

function Tasks() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [canCheckIn, setCanCheckIn] = useState(true);
  const [cooldownText, setCooldownText] = useState('');

  // 1. User ke current points aur last check-in time check karna
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setPoints(data.points || 0);

        // Check-in cooldown check logic
        if (data.lastCheckIn) {
          const lastCheckInTime = new Date(data.lastCheckIn).getTime();
          const currentTime = new Date().getTime();
          const hoursPassed = (currentTime - lastCheckInTime) / (1000 * 60 * 60);

          if (hoursPassed < 24) {
            setCanCheckIn(false);
            // Remaining time calculate karna
            const remainingHours = Math.ceil(24 - hoursPassed);
            setCooldownText(`${remainingHours} Hours left`);
          }
        }
      }
    };

    fetchUserData();
  }, [user]);

  // 2. Daily Check-in Function (20 Points Reward)
  const handleDailyCheckIn = async () => {
    if (!canCheckIn || !user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const now = new Date().toISOString();

      // Database mein points badhana aur time save karna
      await updateDoc(userRef, {
        points: increment(20),
        lastCheckIn: now
      });

      setPoints(prev => prev + 20);
      setCanCheckIn(false);
      setCooldownText('24 Hours left');
      alert('Congratulations! +20 Points added to your wallet.');
    } catch (error) {
      console.error("Error during check-in: ", error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-900/20 to-gray-900 border border-gray-800 p-6 rounded-3xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Earning Zone</h2>
          <p className="text-gray-400 text-sm mt-1">Complete verified tasks to get instant points.</p>
        </div>
        <div className="bg-[#111827] border border-gray-800 px-4 py-3 rounded-2xl text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Your Balance</p>
          <p className="text-xl font-black text-purple-400">{points} Pts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task 1: Daily Check-In */}
        <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">Daily Check-In</h3>
                <p className="text-xs text-gray-400 mt-0.5">Claim free points every 24 hours</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">+20 Pts</span>
          </div>
          
          <button
            onClick={handleDailyCheckIn}
            disabled={!canCheckIn}
            className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              canCheckIn 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20 hover:opacity-90' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canCheckIn ? 'Claim Reward' : `Locked (${cooldownText})`}
          </button>
        </div>

        {/* Task 2: Watch Ads Placeholder */}
        <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex flex-col justify-between opacity-75">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <Play className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">Watch Rewarded Ads</h3>
                <p className="text-xs text-gray-400 mt-0.5">Integration coming in Phase 5</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg">Admin Choice</span>
          </div>
          <button disabled className="w-full mt-6 bg-gray-800 text-gray-500 py-3 rounded-xl font-semibold text-sm cursor-not-allowed">
            Coming Soon
          </button>
        </div>
      </div>

      {/* Sustainability Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-2xl flex items-start space-x-3">
        <ShieldAlert className="h-5 w-5 text-yellow-500/80 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong>Fair Play Rule:</strong> LuminaEarn automated security patterns detect multiple accounts or VPN usage. Genuine activity ensures smooth and verified withdrawals to your local provider.
        </p>
      </div>
    </div>
  );
}

export default Tasks;
