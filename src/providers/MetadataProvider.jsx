import React, { createContext, useContext, useEffect, useState } from 'react';
import MetadataManager from '../common/MetadataManager';

const MetadataContext = createContext({
  metadataManager: null,
  metadata: null,
  loading: true,
  error: null
});

export const MetadataProvider = ({ children, waiting, token }) => {
  const [metadataManager, setMetadataManager] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initMetadataManager = async () => {
      if (token)
      {
        try {
          const manager = MetadataManager;
          await manager.getFileId(); // Ensure file ID is fetched
  
          // Fetch and set metadata
          const fileMetadata = await manager.getMetadata();
          setMetadata(fileMetadata);
  
          setMetadataManager(manager);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    initMetadataManager();
  }, [token]);

  if (loading) {
    return waiting || <div>Loading metadata...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <MetadataContext.Provider value={{ metadataManager, metadata }}>
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (context === null) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }
  return context;
};
