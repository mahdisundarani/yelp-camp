import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // undefined = still loading, null = logged out, object = logged in user
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    axios.get('http://localhost:3000/me', { withCredentials: true })
      .then(res => setCurrentUser(res.data.user || null))
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
