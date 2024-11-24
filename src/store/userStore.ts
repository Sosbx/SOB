import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from './authStore';

interface UserProfile {
  firstName: string;
  lastName: string;
  rpps: string;
  adeli: string;
  specialty: string;
  signature: string | null;
}

interface UserStore {
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => void;
}

const initialProfile: UserProfile = {
  firstName: '',
  lastName: '',
  rpps: '',
  adeli: '',
  specialty: 'Médecin généraliste',
  signature: null,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      updateProfile: async (newProfile) => {
        const { user } = useAuthStore.getState();
        const updatedProfile = { ...get().profile, ...newProfile };
        
        // Mettre à jour le store local
        set({ profile: updatedProfile });
        
        // Mettre à jour Firestore si l'utilisateur est connecté
        if (user) {
          try {
            const userRef = doc(db, 'profiles', user.uid);
            await updateDoc(userRef, {
              ...newProfile,
              updatedAt: new Date(),
            });
          } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            throw error;
          }
        }
      },
      clearProfile: () => set({ profile: initialProfile }),
    }),
    {
      name: 'user-profile',
      partialize: (state) => ({
        profile: {
          ...state.profile,
          signature: state.profile.signature // Persister la signature
        }
      }),
    }
  )
);