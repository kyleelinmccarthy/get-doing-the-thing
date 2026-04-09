import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
  type StoredUser,
} from "./storage";

interface AuthState {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, user: StoredUser) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [token, storedUser] = await Promise.all([getToken(), getUser()]);
      if (token && storedUser) {
        setUserState(storedUser);
      }
      setIsLoading(false);
    })();
  }, []);

  const signIn = useCallback(
    async (token: string, userData: StoredUser) => {
      await Promise.all([setToken(token), setUser(userData)]);
      setUserState(userData);
    },
    []
  );

  const signOut = useCallback(async () => {
    await clearToken();
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
