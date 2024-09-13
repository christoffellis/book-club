import React from 'react';
import styled from 'styled-components';
import { useGetBooksInGenre } from '../../common/useGetBookInGenre';
import { genreColors } from '../../enums';
import { useMetadata, useToken } from '../../providers';

const BookContainer = styled.div`
  flex: ${({ width }) => `${width} 0 auto`};
  aspect-ratio: ${({ aspectRatio }) => aspectRatio};
  background: ${({ isActive, genre }) =>
    isActive
      ? `linear-gradient(to top, ${genreColors[genre]}, #222)`
      : `linear-gradient(to top, #111, #111)`};
  transition: background 2s ease-in-out;
`;

export const GenreBookDisplay = ({
  booksByGenre,
  genre,
  activeGenre,
  updateWidth,
  genreWidths
}) => {
  const { token } = useToken();
  const { metadata, metadataManager } = useMetadata();

  const { booksInGenre, subGenres, loading, error } = useGetBooksInGenre(
    token,
    booksByGenre,
    genre,
    metadataManager
  );

  React.useEffect(() => {
    const totalGenreWidth = booksInGenre.reduce((sum, book) => {
      let width = book.volumeInfo.dimensions.thickness.replace(' cm', '');
      return sum + parseFloat(width);
    }, 0);

    updateWidth(genre, totalGenreWidth);
  }, [genre, booksInGenre]);

  console.log(booksInGenre);

  return booksInGenre.map((book, index) => {
        console.log(book);
        let { width, height } = book.volumeInfo.dimensions;
        width = width.replace(' cm', '');
        height = height.replace(' cm', '');

        const aspectRatio = parseFloat(width) / parseFloat(height);
        const isActive = activeGenre === genre;

        return (
          <BookContainer
            key={index}
            width={width}
            aspectRatio={aspectRatio}
            genre={genre}
            isActive={isActive}
            style={{
              height: `calc(${width} / ${aspectRatio})`
            }}
          />
        );
      }
  );
};
