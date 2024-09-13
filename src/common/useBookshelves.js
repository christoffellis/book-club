// useBookshelves.js
import { useState, useEffect } from 'react';

const BOOKSHELVES_URL = 'https://www.googleapis.com/books/v1/mylibrary/bookshelves';

// Cache to store fetched bookshelves data
let cachedBookshelves = null;

export const useBookshelves = (accessToken) => {
  const [bookshelves, setBookshelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      setError('No access token provided');
      setLoading(false);
      return;
    }

    // If cachedBookshelves is not null, use it and skip fetching
    if (cachedBookshelves) {
      setBookshelves(cachedBookshelves);
      setLoading(false);
      return;
    }

    const fetchBookshelves = async () => {
      try {
        const response = await fetch(BOOKSHELVES_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        const targetBookshelf = (data.items || []).find(
          (shelf) => shelf.title === "My NightLight Shelf"
        );

        // Cache the fetched data
        cachedBookshelves = targetBookshelf;

        setBookshelves(targetBookshelf);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookshelves();
  }, [accessToken]);

  return { bookshelves, loading, error };
};
