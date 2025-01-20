import { useState } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Auth logic implementation

  return {
    isAuthenticated,
    user,
    login: () => {},
    logout: () => {},
  };
};