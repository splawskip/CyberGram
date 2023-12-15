import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser, IContextType } from '@/types';
import { getCurrentUser } from '@/lib/appwrite/api';

// Scaffold initial user object.
export const INITIAL_USER = {
  id: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
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

function AuthProvider({ children } : { children: React.ReactNode }) {
  const [user, setUser] = React.useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const navigate = useNavigate();
  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          username: currentAccount.username,
          name: currentAccount.name,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    // If there is no current session, redirect to sign in page.
    if (localStorage.getItem('sessionId') === '[]' || localStorage.getItem('sessionId') === null) {
      navigate('/sign-in');
    }
    // Check if we should authenitcate a user.
    checkAuthUser();
  }, [navigate]);
  // Create value for the context.
  const value = React.useMemo(() => ({
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  }), [user, isAuthenticated, isLoading]);
  // Render AuthContext Provider.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useUserContext = () => React.useContext(AuthContext);
