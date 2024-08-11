import React, { useState, useEffect } from 'react';

// Define the component
const BookInfo = ({ barcode }) => {
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (barcode) {
      // Step 1: Fetch the Google Books ID using the ISBN
      const fetchBookId = async () => {
        try {
          const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${barcode}`;
          const response = await fetch(url);
          const data = await response.json();

          console.log('isbn', data)

          if (data.items && data.items.length > 0) {
            const bookId = data.items[0].id;

            // Step 2: Fetch additional details using the book ID
            const detailsUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();

            console.log('id', detailsData)
            
            setBookData(detailsData.volumeInfo);
          } else {
            setError('No book found with this ISBN.');
          }
        } catch (err) {
          setError('Failed to fetch book information.');
        } finally {
          setLoading(false);
        }
      };

      fetchBookId();
    }
  }, [barcode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!bookData) {
    return <div>No book data available.</div>;
  }

  // Render the book information
  return (
    <div>
      <h2>{bookData.title}</h2>
      <h3>by {bookData.authors?.join(', ')}</h3>
      <p><strong>Publisher:</strong> {bookData.publisher}</p>
      <p><strong>Published Date:</strong> {bookData.publishedDate}</p>
      <p><strong>Description:</strong> {bookData.description}</p>
      <p><strong>Google Books ID:</strong> {bookData.id}</p>
      {bookData.dimensions && (
        <>
            <p><strong>Physical Dimensions:</strong></p>
            <p>Height: {bookData.dimensions.height}</p>
            <p>Width: {bookData.dimensions.width}</p>
            <p>Thick: {bookData.dimensions.thickness}</p>
        </>
      )}
      {bookData.imageLinks && (
        <img src={bookData.imageLinks.thumbnail} alt={bookData.title} />
      )}
    </div>
  );
};

export default BookInfo;
