import React from 'react';
import styled from 'styled-components';
import { useGetBooksInGenre } from '../../common/useGetBookInGenre';
import { genreColors } from '../../enums';
import { useMetadata, useToken } from '../../providers';

const BookContainer = styled.div`
  flex: ${({ width }) => `${width} 0 auto`};
  aspect-ratio: ${({ aspectRatio }) => aspectRatio};
  background: ${({ isActive, genre }) => isActive 
    ? `linear-gradient(to top, ${genreColors[genre]}, #222)` 
    : `linear-gradient(to top, #111, #111)`};
  transition: background 2s ease-in-out;
`;

export const GenreBookDisplay = ({ booksByGenre, genre, activeGenre }) => {

  const { token } = useToken();
  const { metadata } = useMetadata(); 
  const { booksInGenre, subGenres, loading, error } = useGetBooksInGenre(token, booksByGenre, genre, metadata);

  return booksInGenre.map((book, index) => {
    let { width, height } = book.volumeInfo.dimensions;

    width = width.replace(' cm', '');
    height = height.replace(' cm', '');

    const aspectRatio = parseFloat(height) / parseFloat(width);
    const isActive = activeGenre === genre;

    return (
      <BookContainer
        key={index}
        width={width}
        aspectRatio={aspectRatio}
        genre={genre}
        isActive={isActive}
      />
    );
  });
};
