import { useState, useEffect } from 'react';
import type { User } from '../types';
import { db } from '../firebase/config';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const userCache = new Map<string, User>();

export const useUser = (userId: string | null | undefined) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    if (userCache.has(userId)) {
      setUser(userCache.get(userId)!);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          const fetchedUser: User = {
            id: userDocSnap.id,
            name: data.name,
            email: data.email,
            avatarUrl: data.avatarUrl,
            createdAt: (data.createdAt && typeof data.createdAt.toDate === 'function') ? data.createdAt.toDate() : new Date(),
            reputation: data.reputation || 0,
          };
          userCache.set(userId, fetchedUser);
          setUser(fetchedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading };
};