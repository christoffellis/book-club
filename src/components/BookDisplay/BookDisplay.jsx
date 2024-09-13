import React, { useState, useEffect } from 'react';
import { GenreBookDisplay } from './GenreBookDisplay';
import { genreColors } from '../../enums';
import { ledController } from '../../common/ledController';

export const BookDisplay = ({ booksByGenre = {}, activeGenre }) => {
  const [totalWidth, setTotalWidth] = useState(0);
  const [genreWidths, setGenreWidths] = useState({});

  const updateWidth = (genre, width) => {
    setGenreWidths((prevWidths) => {
      const newWidths = { ...prevWidths, [genre]: width };
      const newTotalWidth = Object.values(newWidths).reduce((acc, curr) => acc + curr, 0);
      setTotalWidth(newTotalWidth);
      return newWidths;
    });
  };

  useEffect(() => {
    if (activeGenre && totalWidth > 0) {
      const LED_SPACING_CM = 1.5; // Distance between LEDs in cm

      const getLedIndex = (positionCm) => {
        return Math.floor(positionCm / LED_SPACING_CM);
      };
      
      const startCm = (Object.keys(genreWidths)
        .slice(0, Object.keys(genreWidths).indexOf(activeGenre))
        .reduce((acc, genre) => acc + genreWidths[genre], 0) / totalWidth * 100) * totalWidth / 100;
      
      const activeWidth = genreWidths[activeGenre]; // Width of the active genre in cm

      console.log('active width', activeWidth);
      
      const endCm = startCm + (activeWidth / totalWidth * 100 * totalWidth / 100);
      
      const startLed = getLedIndex(startCm);
      const endLed = getLedIndex(endCm);

      const hexColor = genreColors[activeGenre];

      const hexToRgb = (hex) => {
        // Remove the '#' if present
        const cleanedHex = hex.replace(/^#/, '');
      
        // Parse the hex string into r, g, b values
        const bigint = parseInt(cleanedHex, 16);
        return {
          r: (bigint >> 16) & 255,
          g: (bigint >> 8) & 255,
          b: bigint & 255
        };
      };
      
      const color = hexToRgb(hexColor);

      console.log(`Setting LEDs for ${activeGenre}: start=${startLed}, end=${endLed}`);

      ledController.setLeds(startLed, endLed, color).catch(error => {
        console.error('Error setting LEDs:', error);
      });
    }
  }, [activeGenre]);

  const Genres = Object.keys(booksByGenre).map((genre) => (
    <GenreBookDisplay
      key={genre}
      genre={genre}
      booksByGenre={booksByGenre}
      activeGenre={activeGenre}
      updateWidth={updateWidth}
      genreWidths={genreWidths}  // Pass genreWidths to each GenreBookDisplay
    />
  ));

  useEffect(() => {
    // Log the total width whenever it changes (for debugging purposes)
    console.log('Total Width:', totalWidth);
  }, [totalWidth]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%', height: '100%' }}>
      {Genres}
    </div>
  );
};
