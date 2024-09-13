import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the token
const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (token) {
        try {
          setLoggedIn(true);
        } catch (error) {
          console.error('Failed to initialize MetadataManager:', error);
          setLoggedIn(false);
        }
      }
    };

    initialize();
  }, [token]);

  return (
    <TokenContext.Provider value={{ token, setToken, loggedIn, setLoggedIn }}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook to use the token context
export const useToken = () => useContext(TokenContext);
