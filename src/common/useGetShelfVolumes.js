// useBookshelfVolumes.js
import { useState, useEffect } from 'react';

const BOOKSHELF_VOLUMES_URL = 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/{shelfId}/volumes';

// Caching object to store data for different shelfIds
const cachedBooksByGenre = {};

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export const useGetShelfVolumes = (accessToken, shelfId) => {
  const [booksByGenre, setBooksByGenre] = useState(cachedBooksByGenre[shelfId] || {});
  const [loading, setLoading] = useState(!cachedBooksByGenre[shelfId]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken || !shelfId) {
      setError('No access token or shelf ID provided');
      setLoading(false);
      return;
    }

   
    if (cachedBooksByGenre[shelfId]) {
      setBooksByGenre(cachedBooksByGenre[shelfId]);
      setLoading(false);
      return;
    }

    const fetchVolumes = async () => {
      try {
        const response = await fetch(BOOKSHELF_VOLUMES_URL.replace('{shelfId}', shelfId), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const books = data.items || [];

       
        const categorizedBooks = books.reduce((acc, book) => {
          const genres = book.volumeInfo.categories || ['Unknown'];

          genres.forEach((genre) => {
            const lowerGenre = toTitleCase(genre);

            if (!acc[lowerGenre]) {
              acc[lowerGenre] = [];
            }
            acc[lowerGenre].push(book);
          });

          return acc;
        }, {});

       
        cachedBooksByGenre[shelfId] = categorizedBooks;

        setBooksByGenre(categorizedBooks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVolumes();
  }, [accessToken, shelfId]);

  return { booksByGenre, loading, error };
};
