import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IUser, IContextType } from '@/types';
import { getCurrentUser } from '@/lib/appwrite/api';

// Scaffold initial user object.
export const INITIAL_USER = {
  id: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
  imageId: '',
  bio: '',
};

// Scaffold initial value for state.
const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

// Create context.
const AuthContext = React.createContext<IContextType>(INITIAL_STATE);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = React.useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageId: currentAccount.imageId,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  // Check auth user effect.
  React.useEffect(() => {
    // Get cookie fallback.
    const userSession = localStorage.getItem('cookieFallback') ?? false;
    // Check if we should redirect to sign page.
    if ((!userSession || userSession === '[]') && pathname !== '/sign-up') {
      navigate('/sign-in');
    }
    // Check auth user.
    checkAuthUser();
  }, []); // eslint-disable-line
  // Build context object.
  const value = React.useMemo(() => ({
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  }), [user, isAuthenticated, isLoading]);
  // Build provider component.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => React.useContext(AuthContext);
