import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

interface AuthContextInterface {
    currentUser: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<User>;
    signUp: (email: string, password: string) => Promise<User>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context){
        console.error("useAuth must be used within AuthProvider");
        return;
    }
    return context;
}


export default function AuthProvider({ children} : {children: React.ReactNode}){

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const signUp = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    }

    const signIn = async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    }

    const logout = async () => {
        await signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        })

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}

