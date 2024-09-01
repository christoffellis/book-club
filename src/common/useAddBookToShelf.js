// useAddBookToShelf.js
import { useState } from 'react';

const ADD_BOOK_URL = 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/{shelfId}/addVolume?volumeId={volumeId}';

export const useAddBookToShelf = (accessToken) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addBookToShelf = async (shelfId, volumeId) => {
    if (!accessToken) {
      setError('No access token provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(ADD_BOOK_URL
        .replace('{shelfId}', shelfId)
        .replace('{volumeId}', volumeId), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addBookToShelf, loading, error };
};
