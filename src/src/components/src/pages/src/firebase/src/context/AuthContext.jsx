import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign Up / Register Function
  async function signUp(email, password, fullName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Naye user ka profile Firestore Database me banana (0 Points ke sath)
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      name: fullName,
      email: email,
      points: 0,
      role: "user", // Admin panel ke liye check
      createdAt: new Date().toISOString()
    });
    
    return userCredential;
  }

  // Login Function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout Function
  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, signUp, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
