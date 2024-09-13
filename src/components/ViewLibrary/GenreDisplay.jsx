import React, { useState, useEffect } from 'react';
import { Box, Fab, Typography } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useGetBooksInGenre } from '../../common/useGetBookInGenre';
import { GenreBookDisplay } from '../BookDisplay/GenreBookDisplay';

// Define book genre colors
const genreColors = {
  'Fiction': '#4A148C',
  'History': '#F57F17',
  'Young Adult': '#C2185B',
  'Mystery': '#1976D2',
  'Science Fiction': '#388E3C',
  'Business & Economics': '#00796B',
  'Biography & Autobiography': '#FF5722'
};

export const GenreDisplay = ({
  token,
  index,
  genre,
  booksByGenre
}) => {

  const { booksInGenre, subGenres, loading, error } = useGetBooksInGenre(token, booksByGenre, genre);

  return (

      <Box
        sx={{
          height: '90%', 
          display: 'flex',
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
        }}
      >
        <GenreBookDisplay
          books={booksInGenre}
        />
        <Typography
          variant="h4"
          sx={{ color: '#ffffff', fontFamily: 'Spotify, sans-serif' }}
        >
          {genre.charAt(0).toUpperCase() + genre.slice(1)}
        </Typography>
      </Box>
           
  );
};
