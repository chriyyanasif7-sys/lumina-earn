import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { CalendarCheck, Play, ShieldAlert, XCircle, Loader2 } from 'lucide-react';

function Tasks() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [canCheckIn, setCanCheckIn] = useState(true);
  const [cooldownText, setCooldownText] = useState('');
  
  // Ad States
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adCountdown, setAdCountdown] = useState(15); // 15 Seconds Secure Web Ad

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setPoints(data.points || 0);

        if (data.lastCheckIn) {
          const lastCheckInTime = new Date(data.lastCheckIn).getTime();
          const currentTime = new Date().getTime();
          const hoursPassed = (currentTime - lastCheckInTime) / (1000 * 60 * 60);

          if (hoursPassed < 24) {
            setCanCheckIn(false);
            const remainingHours = Math.ceil(24 - hoursPassed);
            setCooldownText(`${remainingHours} Hours left`);
          }
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Daily Check-in Logic
  const handleDailyCheckIn = async () => {
    if (!canCheckIn || !user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const now = new Date().toISOString();

      await updateDoc(userRef, {
        points: increment(20),
        lastCheckIn: now
      });

      setPoints(prev => prev + 20);
      setCanCheckIn(false);
      setCooldownText('24 Hours left');
      alert('Congratulations! +20 Points added to your wallet.');
    } catch (error) {
      alert('Something went wrong. Please try again.');
    }
  };

  // Rewarded Ad Starter Logic
  const startRewardedAd = () => {
    setIsAdPlaying(true);
    setAdCountdown(15);
  };

  // Ad Timer Hook
  useEffect(() => {
    let timer;
    if (isAdPlaying && adCountdown > 0) {
      timer = setInterval(() => {
        setAdCountdown(prev => prev - 1);
      }, 1000);
    } else if (isAdPlaying && adCountdown === 0) {
      // Reward claim trigger callback
      handleAdRewardClaim();
    }
    return () => clearInterval(timer);
  }, [isAdPlaying, adCountdown]);

  // Securely credit points after full completion
  const handleAdRewardClaim = async () => {
    setIsAdPlaying(false);
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      // Admin dynamically sets 10 points per Ad view
      await updateDoc(userRef, {
        points: increment(10)
      });

      setPoints(prev => prev + 10);
      alert('Ad Completed! +10 Points successfully credited to your wallet.');
    } catch (error) {
      alert('Failed to credit points. Please try again.');
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto relative">
      
      {/* Premium Video Ad Modal Backdrop */}
      {isAdPlaying && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full border border-gray-800 bg-[#111827] p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000" 
                style={{ width: `${((15 - adCountdown) / 15) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 text-purple-500 animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Streaming Sponsored Ad</h3>
              <p className="text-sm text-gray-400">Please do not close or refresh the window to guarantee your rewards.</p>
            </div>

            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              00:{adCountdown < 10 ? `0${adCountdown}` : adCountdown}
            </div>

            <button 
              onClick={() => {
                if(confirm("If you close early, you won't receive the reward tokens. Close anyway?")) {
                  setIsAdPlaying(false);
                }
              }}
              className="text-xs text-gray-500 hover:text-red-400 flex items-center justify-center space-x-1 mx-auto pt-4 transition-colors"
            >
              <XCircle className="h-4 w-4" />
              <span>Cancel Ad Stream</span>
            </button>
          </div>
        </div>
      )}

      {/* Main UI Header */}
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
        {/* Daily Check-In Component */}
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

        {/* Dynamic Rewarded Ad Action */}
        <div className="bg-[#111827] border border-gray-800 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <Play className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">Watch Video Ads</h3>
                <p className="text-xs text-gray-400 mt-0.5">Watch premium sponsors to receive balance</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg">+10 Pts</span>
          </div>
          
          <button 
            onClick={startRewardedAd}
            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:opacity-90 transition-all"
          >
            Launch Video Ad
          </button>
        </div>
      </div>

      {/* Security Alerts */}
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
