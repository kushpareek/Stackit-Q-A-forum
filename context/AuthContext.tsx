import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '../types';
import { auth, db } from '../firebase/config';
import { 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    type User as FirebaseUser
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";


export interface LoginCredentials {
  email: string;
  password: string;
}
export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  signup: (credentials: SignUpCredentials) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setCurrentUser({
                    id: firebaseUser.uid,
                    name: userData.name,
                    email: userData.email,
                    avatarUrl: userData.avatarUrl,
                    createdAt: (userData.createdAt && typeof userData.createdAt.toDate === 'function') ? userData.createdAt.toDate() : new Date(),
                    reputation: userData.reputation || 0,
                });
            }
        } else {
            setCurrentUser(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const login = async (credentials: LoginCredentials) => {
    await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
  };

  const signup = async (credentials: SignUpCredentials) => {
    const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
        name: credentials.name,
        email: credentials.email,
        avatarUrl: `https://picsum.photos/seed/${user.uid}/40/40`,
        createdAt: serverTimestamp(),
        reputation: 0,
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};