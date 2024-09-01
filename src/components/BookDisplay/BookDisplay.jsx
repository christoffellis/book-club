import React from 'react';
import { GenreBookDisplay } from './GenreBookDisplay';

export const BookDisplay = ({ booksByGenre = [], activeGenre}) => {

  const Genres = [];

  if (!Genres.length)
  {
    for (const genre in booksByGenre)
      {
        Genres.push(
          <GenreBookDisplay
            key={genre}
            genre={genre}
            booksByGenre={booksByGenre}
            activeGenre={activeGenre}
          />
        );
      }    
  }
  
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', width: "100%", height: '100%' }}>
      {Genres}
    </div>
  );
};
