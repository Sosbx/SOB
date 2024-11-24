import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useUserStore } from './userStore';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string, isRegistering: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  linkProfileToUser: (profileData: any) => Promise<void>;
}

const ALLOWED_DOMAINS = ['h24.scm.com', 'h24scm.com'];

const isEmailDomainAllowed = (email: string): boolean => {
  const domain = email.split('@')[1];
  return ALLOWED_DOMAINS.includes(domain);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,

      signInWithGoogle: async () => {
        try {
          set({ loading: true, error: null });
          const result = await signInWithPopup(auth, googleProvider);

          if (!isEmailDomainAllowed(result.user.email || '')) {
            set({ 
              error: 'Domaine email non autorisé. Utilisez une adresse @h24scm.com',
              loading: false,
              user: null 
            });
            return;
          }

          const profileDoc = await getDoc(doc(db, 'profiles', result.user.uid));
          const profileData = {
            email: result.user.email,
            firstName: result.user.displayName?.split(' ')[0] || '',
            lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
            updatedAt: new Date(),
          };

          if (!profileDoc.exists()) {
            await setDoc(doc(db, 'profiles', result.user.uid), {
              ...profileData,
              createdAt: new Date(),
            });
          }

          useUserStore.getState().updateProfile({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
          });

          set({ user: result.user, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
          throw error;
        }
      },

      signInWithEmail: async (email, password, isRegistering) => {
        try {
          set({ loading: true, error: null });

          if (isRegistering && !isEmailDomainAllowed(email)) {
            set({ 
              error: 'Domaine email non autorisé. Utilisez une adresse @h24scm.com',
              loading: false 
            });
            return;
          }
          
          let userCredential;
          
          if (isRegistering) {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'profiles', userCredential.user.uid), {
              email: userCredential.user.email,
              createdAt: new Date(),
            });
          } else {
            userCredential = await signInWithEmailAndPassword(auth, email, password);
          }
          
          set({ user: userCredential.user, loading: false });

          const profileDoc = await getDoc(doc(db, 'profiles', userCredential.user.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            useUserStore.getState().updateProfile({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              rpps: data.rpps || '',
              adeli: data.adeli || '',
              signature: data.signature || null,
            });
          }
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
          throw error;
        }
      },

      signOut: async () => {
        try {
          await firebaseSignOut(auth);
          set({ user: null, loading: false });
          useUserStore.getState().clearProfile();
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      linkProfileToUser: async (profileData) => {
        try {
          const { user } = useAuthStore.getState();
          if (!user) throw new Error('Aucun utilisateur connecté');

          await setDoc(doc(db, 'profiles', user.uid), {
            ...profileData,
            email: user.email,
            updatedAt: new Date(),
          });
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

onAuthStateChanged(auth, async (user) => {
  useAuthStore.setState({ user, loading: false });
  
  if (user) {
    const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
    if (profileDoc.exists()) {
      const data = profileDoc.data();
      useUserStore.getState().updateProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        rpps: data.rpps || '',
        adeli: data.adeli || '',
        signature: data.signature || null,
      });
    }
  }
});