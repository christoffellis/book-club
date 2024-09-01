import React, { createContext, useContext, useState, useEffect } from 'react';
import MetadataManager from '../common/MetadataManager';

// Create a context for the token
const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (token) {
        MetadataManager.accessToken = token;
        try {
          await MetadataManager.getFileId(); // Wait for file ID retrieval
          setLoggedIn(true); // Set loggedIn to true only after file content is successfully loaded
        } catch (error) {
          console.error('Failed to initialize MetadataManager:', error);
          setLoggedIn(false); // Ensure loggedIn is set to false on error
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
