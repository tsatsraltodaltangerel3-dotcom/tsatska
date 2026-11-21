import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
} from 'firebase/auth';
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

function formatAuthError(err: unknown): string | null {
  const code = err instanceof FirebaseError ? err.code : '';
  const message = err instanceof Error ? err.message : String(err);

  if (
    code === 'auth/popup-closed-by-user' ||
    code === 'auth/cancelled-popup-request' ||
    message.includes('popup-closed-by-user')
  ) {
    return null;
  }

  const host = typeof window !== 'undefined' ? window.location.hostname : '';

  if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
    return `Энэ домэйн (${host}) Firebase Authorized Domains жагсаалтад бүртгэгдээгүй байна. Firebase Console → Authentication → Settings → Authorized domains хэсэгт "${host}"-ийг нэмнэ үү.`;
  }

  if (code === 'auth/popup-blocked') {
    return 'Хөтөч нэвтрэх цонхыг (popup) хаасан байна. Popup зөвшөөрөөд дахин оролдоно уу.';
  }

  if (code === 'auth/operation-not-allowed') {
    return 'Firebase Authentication дээр Google нэвтрэлт идэвхжээгүй байна (auth/operation-not-allowed).';
  }

  if (code === 'auth/network-request-failed') {
    return 'Сүлжээний алдаа гарлаа. Интернэт холболтоо шалгаад дахин оролдоно уу.';
  }

  return `Google-ээр нэвтрэх үед алдаа гарлаа (${code || 'auth-error'}). Дахин оролдоно уу.`;
}

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    getRedirectResult(auth).catch((err) => {
      console.error('Firebase redirect login error:', err);
      const formatted = formatAuthError(err);
      if (formatted) {
        setAuthError(formatted);
      }
    });

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
      console.error('Firebase Google sign-in error:', err);
      const code = err instanceof FirebaseError ? err.code : '';
      if (code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          console.error('Firebase Google redirect fallback error:', redirectErr);
          const formattedRedirect = formatAuthError(redirectErr);
          if (formattedRedirect) {
            setAuthError(formattedRedirect);
          }
          return;
        }
      }
      const formatted = formatAuthError(err);
      if (formatted) {
        setAuthError(formatted);
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
