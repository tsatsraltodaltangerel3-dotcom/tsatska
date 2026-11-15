import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { ADMIN_EMAIL, auth, googleProvider } from '../firebase';

interface FirebaseContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Нэвтрэх үед алдаа гарлаа';
      if (!msg.includes('popup-closed-by-user')) {
        setAuthError('Google-ээр нэвтрэх үед алдаа гарлаа. Дахин оролдоно уу.');
      }
    }
  };

  const logOut = async () => {
    setAuthError(null);
    await signOut(auth);
  };

  const isAdmin = Boolean(
    user && user.emailVerified && user.email === ADMIN_EMAIL
  );

  return (
    <FirebaseContext.Provider
      value={{ user, authReady, isAdmin, authError, signInWithGoogle, logOut }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export function useFirebase(): FirebaseContextValue {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used inside FirebaseProvider');
  }
  return ctx;
}
