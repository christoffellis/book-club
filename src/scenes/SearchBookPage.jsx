import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Define book genre colors
const genreColors = {
  fantasy: '#4A148C',
  history: '#F57F17',
  youngAdult: '#C2185B',
  mystery: '#1976D2',
  scienceFiction: '#388E3C',
};

const genres = Object.keys(genreColors);

export const SearchBookPage = () => {
  const [activeColor, setActiveColor] = useState(genreColors.fantasy);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => {
      setActiveColor(genreColors[genres[next]]);
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: '#000000',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '600px',
          height: '90%',
          maxHeight: '600px',
          backgroundColor: '#1a1a1a',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Color Box */}
        <Box
          sx={{
            position: 'absolute',
            top: '-40%',
            left: '15%',
            width: '70%',
            height: '70%',
            backgroundColor: activeColor,
            filter: 'blur(10vh)',
            borderRadius: '50%',
            pointerEvents: 'none',
            transition: 'background-color 0.5s ease',
          }}
        />
       <Box sx={{ overflow: 'hidden', width: '100%', height: 'auto', flexDirection: 'column',
      justifyContent: 'flex-end' }}>
        <Slider {...settings}>
          {genres.map((genre, index) => (
            <div key={index}>
              <Typography
                variant="h4"
                sx={{ color: '#ffffff', fontFamily: 'Spotify, sans-serif' }}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </Typography>
            </div>
          ))}
        </Slider>
      </Box>

      </Box>
    </Box>
  );
};
