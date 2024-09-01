import { useState, useEffect } from 'react';
import MetadataManager from './MetadataManager';

const BOOK_VOLUME_URL = 'https://www.googleapis.com/books/v1/volumes/{volumeId}';

// Cache objects to store fetched data
const cachedBooksInGenre = {};
const cachedSubGenres = {};

const getSubGenres = (categories) => {
  if (!categories || categories.length === 0) return [];
  const firstCategory = categories[0];
  return firstCategory.split('/').map(subGenre => subGenre.trim());
};

export const useGetBooksInGenre = (accessToken, booksByGenre, genre, metadata) => {
 
  const [booksInGenre, setBooksInGenre] = useState(cachedBooksInGenre[genre] || []);
  const [subGenres, setSubGenres] = useState(cachedSubGenres[genre] || {});
  const [loading, setLoading] = useState(!cachedBooksInGenre[genre]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken || !booksByGenre[genre]) {
      setLoading(false);
      return;
    }

   
    if (cachedBooksInGenre[genre] && cachedSubGenres[genre]) {
      setBooksInGenre(cachedBooksInGenre[genre]);
      setSubGenres(cachedSubGenres[genre]);
      setLoading(false);
      return;
    }

    const fetchBookDetails = async () => {
      try {
        const bookDetailsPromises = booksByGenre[genre].map(async (book) => {
          
          let bookData = metadata.books[book.volumeInfo.industryIdentifiers[0].identifier];

          console.log('from meta', bookData);


          if (!bookData) {
            
            const response = await fetch(BOOK_VOLUME_URL.replace('{volumeId}', book.id), {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            });

            bookData = await response.json();

            console.log('from response', bookData);

            const metadataManager = MetadataManager;

            console.log('manager', metadataManager);

            await metadataManager.addBook(book.volumeInfo.industryIdentifiers[0].identifier, bookData);
          }

          console.log('after fetch from either', bookData);


          return bookData;
        });

        const booksDetails = await Promise.all(bookDetailsPromises);

       
        const subGenresMap = {};
        booksDetails.forEach(book => {
          const categories = book.volumeInfo.categories || [];
          const subGenresList = getSubGenres(categories);

          subGenresList.forEach(subGenre => {
            if (!subGenresMap[subGenre]) {
              subGenresMap[subGenre] = [];
            }
            subGenresMap[subGenre].push(book);
          });
        });

       
        cachedBooksInGenre[genre] = booksDetails;
        cachedSubGenres[genre] = subGenresMap;

        setBooksInGenre(booksDetails);
        setSubGenres(subGenresMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (metadata)
    {
      fetchBookDetails();
    }
  }, [accessToken, booksByGenre, genre, metadata]);

  return { booksInGenre, subGenres, loading, error };
};
