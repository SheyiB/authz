import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { auth } from '../firebase';

export type RegisterPayload = {
  email: string;
  password: string;
  displayName?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  registerWithEmail: (payload: RegisterPayload) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapAuthError = (error: unknown) => {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          return 'An account already exists for that email. Try signing in instead.';
        case 'auth/invalid-email':
          return 'The email address is invalid. Please double-check and try again.';
        case 'auth/weak-password':
          return 'Please choose a stronger password (at least 6 characters).';
        case 'auth/wrong-password':
          return 'That password is incorrect. Try again or reset your password.';
        case 'auth/user-not-found':
          return "Couldn't find an account with that email.";
        case 'auth/popup-closed-by-user':
          return 'The sign-in popup was closed before completing.';
        case 'auth/popup-blocked':
          return 'Your browser blocked the sign-in popup. Allow popups and try again.';
        case 'auth/network-request-failed':
          return 'Network error while contacting Firebase. Check your connection and retry.';
        case 'auth/configuration-not-found':
        case 'auth/invalid-api-key':
          return 'Firebase Auth is not fully configured. Verify your API key and authorised domains in the Firebase console.';
        default:
          return error.message;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Unexpected authentication error. Please try again.';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const registerWithEmail = async ({ email, password, displayName }: RegisterPayload) => {
    try {
      const { user: createdUser } = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName) {
        await updateProfile(createdUser, { displayName });
      }

      if (!createdUser.emailVerified) {
        await sendEmailVerification(createdUser).catch(() => undefined);
      }
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      registerWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signOutUser,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
