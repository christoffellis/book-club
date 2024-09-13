import { CircularProgress } from '@mui/material';
import { Exception } from '@zxing/library';
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const MetadataContext = createContext({
  metadataManager: null,
  metadata: null,
  loading: true,
  error: null,
  addBook: () => {},
});

export const MetadataProvider = ({ children, waiting, token }) => {
  const [metadata, setMetadata] = useState(null);
  const [loadingMessage, setLoadingMessage] = React.useState('Login to get started');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const metadataManager = useMemo(() => {
    return new (class MetadataManager {
      constructor() {
        this.accessToken = '';
        this.initialized = false;
        this.fileId = '';
        this.filePath = 'root/NightLight/metadata.json';
        this.parentFolderId = '';
        this.fileContent = null;
      }

      async init() {
        if (!this.accessToken) {
          throw Exception('No access token was set for the metadata manager.');
        }

        if (!this.initialized) {
          this.initialized = true;
          setLoadingMessage('Checking for the NightLight folder on Google Drive.');
          await this.ParentFolderCreate();
          setLoadingMessage('Checking for the NightLight metadata file.');
          await this.FileCreate();
          setLoadingMessage('Fetching NightLight metadata contents.');
          await this.GetFileContent();
        }
      }

      async ParentFolderCreate() {
        const pathParts = this.filePath.split('/');
        const folderName = pathParts[1];

        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            }
          }
        );
        const data = await response.json();

        if (data.files.length === 0) {
          setLoadingMessage('Creating the NightLight folder on Google Drive.');

          const createResponse = await fetch(
            'https://www.googleapis.com/drive/v3/files',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
              }),
            }
          );
          const createData = await createResponse.json();
          this.parentFolderId = createData.id;
        } else {
          this.parentFolderId = data.files[0].id;
        }
      }

      async FileCreate() {
        const fileName = this.filePath.split('/').pop();

        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${this.parentFolderId}' in parents`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            }
          }
        );
        const data = await response.json();

        if (data.files.length === 0) {

          setLoadingMessage('Creating the NightLight metadata file.');

          const initialContent = {
            metadata: {
              created: new Date().toISOString(),
              description: 'This is a metadata file for books.',
            },
            books: {}
          };

          const createResponse = await fetch(
            'https://www.googleapis.com/drive/v3/files',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: fileName,
                mimeType: 'application/json',
                parents: [this.parentFolderId],
              }),
            }
          );
          const createData = await createResponse.json();
          this.fileId = createData.id;

          await fetch(
            `https://www.googleapis.com/upload/drive/v3/files/${this.fileId}?uploadType=media`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(initialContent),
            }
          );
        } else {
          this.fileId = data.files[0].id;
        }
      }

      async GetFileContent() {
        if (!this.fileId) {
          console.error('File ID is not set.');
          return;
        }

        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${this.fileId}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            }
          }
        );

        if (response.ok) {
          this.fileContent = await response.json();
        } else {
          console.error('Failed to fetch file content:', response.statusText);
          this.fileContent = {};
        }
      }

      async AddBook(isbn, content) {
        if (!this.fileContent) {
          console.error('File content is not loaded.');
          return;
        }

        this.fileContent.books[isbn] = content;

        if (this.updateTimeout) {
          clearTimeout(this.updateTimeout);
        }

        this.updateTimeout = setTimeout(async () => {
          try {
            const response = await fetch(
              `https://www.googleapis.com/upload/drive/v3/files/${this.fileId}?uploadType=media`,
              {
                method: 'PATCH',
                headers: {
                  Authorization: `Bearer ${this.accessToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.fileContent),
              }
            );

            if (!response.ok) {
              console.error('Failed to update file:', response.statusText);
            } else {
              console.log('File updated successfully');
            }
          } catch (error) {
            console.error('Error updating file:', error);
          }
        }, 1000);
      }
    })();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (token) {
        metadataManager.accessToken = token;
        await metadataManager.init();
        setMetadata(metadataManager.fileContent);
        setLoading(false);
      }
    };

    initialize();
  }, [token, metadataManager]);

  const addBook = useCallback((isbn, content) => {
    metadataManager.AddBook(isbn, content);
    setMetadata({ ...metadataManager.fileContent });
  }, [metadataManager]);

  if (loading) {
    return waiting || (!token && <h3 style={{color: '#eee'}} >{loadingMessage}</h3>)|| (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eee', flexDirection: 'column' }}>
        <CircularProgress size={24} style={{ marginRight: 10 }} />
        <h3>{loadingMessage}</h3>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <MetadataContext.Provider value={{ metadataManager, metadata, addBook }}>
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
