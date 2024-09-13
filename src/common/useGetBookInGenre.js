import { useState, useEffect } from 'react';

const BOOK_VOLUME_URL = 'https://www.googleapis.com/books/v1/volumes/{volumeId}';

const LIBRARY_THING_URL = 'https://www.librarything.com/services/rest/1.1/?method=librarything.ck.getwork&isbn={isbn}&apikey=7d123028f9d6f42d35151a67cf34c697';
// Cache objects to store fetched data
const cachedBooksInGenre = {};
const cachedSubGenres = {};

const getSubGenres = (categories) => {
  if (!categories || categories.length === 0) return [];
  const firstCategory = categories[0];
  return firstCategory.split('/').map(subGenre => subGenre.trim());
};

export const useGetBooksInGenre = (accessToken, booksByGenre, genre, metadataManager) => {
 
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

    function loadXmlData(isbn) {
      return new Promise((resolve, reject) => {
        const iframe = document.getElementById('xmlFrame');
        iframe.src = `${LIBRARY_THING_URL.replace('{isbn}', isbn)}`;
        iframe.onload = () => {
          try {
            const xmlDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (xmlDoc) {
              resolve(xmlDoc);
            } else {
              reject(new Error('Failed to access iframe document'));
            }
          } catch (error) {
            reject(error);
          }
        };
        iframe.onerror = () => reject(new Error('Failed to load iframe'));
      });
    }
    
    function processXml(xmlDoc) {
      // Example processing logic
      const title = xmlDoc.getElementsByTagName('title')[0]?.textContent || 'No title';
      return { title };
    
      // Add more processing based on your XML structure
    }

    const fetchBookDetails = async () => {
      try {
        const bookDetailsPromises = booksByGenre[genre].map(async (book) => {
          
          let bookData = metadataManager.fileContent.books[book.volumeInfo.industryIdentifiers[0].identifier];

          if (!bookData) {
            
            const response = await fetch(BOOK_VOLUME_URL.replace('{volumeId}', book.id), {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            });

            bookData = await response.json();

            console.log('book', bookData);

            // bookData.seriesData = seriesData;

            await metadataManager.AddBook(book.volumeInfo.industryIdentifiers[0].identifier, bookData);
          }


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

    console.log('meta', metadataManager);

    if (metadataManager.fileContent)
    {
      fetchBookDetails();
    }
  }, [accessToken, booksByGenre, genre, metadataManager, metadataManager.fileContent]);

  return { booksInGenre, subGenres, loading, error };
};
