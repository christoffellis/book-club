class MetadataManager {
    static instance = null;
    accessToken = '';
  
    constructor() {
      if (MetadataManager.instance) {
        return MetadataManager.instance;
      }

      this.fileId = '';
      this.filePath = 'root/NightLight/metadata.json';
      MetadataManager.instance = this;
    }
  
    static getInstance() {
      if (!MetadataManager.instance) {
        MetadataManager.instance = new MetadataManager();
      }
      return MetadataManager.instance;
    }
  
    async getFileId() {
      if (!this.fileId) {
        try {
         
          const folderResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name='NightLight' and mimeType='application/vnd.google-apps.folder'`,
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
              },
            }
          );
    
          if (!folderResponse.ok) {
            throw new Error(`Error fetching folder ID: ${folderResponse.statusText}`);
          }
    
          const folderData = await folderResponse.json();
          const folderId = folderData.files && folderData.files.length > 0 ? folderData.files[0].id : null;
    
          if (!folderId) {
            throw new Error('Folder "NightLight" not found.');
          }
    
         
          const fileResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name='metadata.json' and '${folderId}' in parents`,
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
              },
            }
          );
    
          if (fileResponse.status === 404) {
           
            console.log('File not found. Creating file...');
            this.fileId = await this.createFile(folderId);
          } else if (!fileResponse.ok) {
            throw new Error(`Error fetching file ID: ${fileResponse.statusText}`);
          } else {
            const fileData = await fileResponse.json();
            if (fileData.files && fileData.files.length > 0) {
             
              this.fileId = fileData.files[0].id;
              console.log(`File found with ID: ${this.fileId}`);
            } else {
             
              console.log('File not found in search results. Creating file...');
              this.fileId = await this.createFile(folderId);
            }
          }
        } catch (error) {
          console.error('Error occurred during file ID retrieval:', error);
         
          this.fileId = await this.createFile();
        }
      }
      
     
      return this.fileId;
    }    
  
    async getFolderId(folderName) {
      console.log(`Attempting to fetch the ID for folder: ${folderName}`);
      try {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder' and 'root' in parents`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );
        
        const data = await response.json();
        console.log('Response from fetching folder ID:', data);
        
        if (data.files && data.files.length > 0) {
          console.log(`Folder "${folderName}" found with ID: ${data.files[0].id}`);
          return data.files[0].id;
        } else {
          console.log(`Folder "${folderName}" not found, attempting to create it.`);
          return await this.createFolder(folderName);
        }
      } catch (error) {
        console.error('Error fetching folder ID:', error);
        return null;
      }
    }
    
    async createFolder(folderName) {
      console.log(`Attempting to create folder: ${folderName}`);
      try {
        const response = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: ['root'],
          }),
        });
    
        const folderData = await response.json();
        console.log('Response from folder creation:', folderData);
        return folderData.id;
      } catch (error) {
        console.error('Error creating folder:', error);
        return null;
      }
    }
    
    async createFile() {
      console.log('Attempting to create the file "metadata.json"...');
      try {
       
        const folderId = await this.getFolderId('NightLight');
        if (!folderId) {
          throw new Error('NightLight folder not found and could not be created');
        }
        console.log(`Using folder ID: ${folderId} for file creation.`);
    
        const response = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'metadata.json',
            parents: [folderId],
            mimeType: 'application/json',
          }),
        });
    
        console.log('Response from file creation:', response);
        if (!response.ok) {
          throw new Error(`Error creating file: ${response.statusText}`);
        }
    
        const fileData = await response.json();
        console.log('File created successfully:', fileData);
    
        const initialData = {
          metadata: {},
          books: {},
        };
    
        await this.setMetadata(initialData, fileData.id);
        console.log(`Metadata initialized in the file with ID: ${fileData.id}`);
    
        return fileData.id;
      } catch (error) {
        console.error('Error creating file:', error);
        return null;
      }
    }
    
    
    async getMetadata() {
      try {
        await this.getFileId();
  
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${this.fileId}?alt=media`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );
  
        const metadata = await response.json();
        return metadata;
      } catch (error) {
        console.error('Error fetching metadata:', error);
        return null;
      }
    }
  
    async setMetadata(updatedMetadata, specificFileId = null) {
      try {
        await this.getFileId();
  
        const fileId = specificFileId || this.fileId;
  
        const response = await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMetadata),
          }
        );
  
        if (!response.ok) {
          throw new Error('Error updating metadata');
        }
  
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Error setting metadata:', error);
        return null;
      }
    }
  
    async getBookInfo(isbn) {
      const metadata = await this.getMetadata();
      if (metadata && metadata.books) {
        return metadata.books[isbn];
      }
      return null;
    }
  
    async setBookInfo(isbn, bookInfo) {
      const metadata = await this.getMetadata();
      if (metadata) {
        metadata.books = metadata.books || {};
        metadata.books[isbn] = bookInfo;
        return await this.setMetadata(metadata);
      }
      return null;
    }
  
    async addBook(isbn, bookInfo) {
      const metadata = await this.getMetadata();
      if (metadata) {
        metadata.books = metadata.books || {};
        
        if (!metadata.books[isbn]) {
          metadata.books[isbn] = bookInfo;
          return await this.setMetadata(metadata);
        } else {
          throw new Error('Book with this ISBN already exists.');
        }
      }
      return null;
    }
  }
  
  export default MetadataManager.getInstance();
