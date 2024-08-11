import React, { useState } from 'react';
import { Box, Fab, Typography } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import AddIcon from '@mui/icons-material/Add';
import 'slick-carousel/slick/slick-theme.css';
import { BookModal } from '../components/BookModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
        overflow: 'hidden',
        position: 'relative'
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
            width: '50vh',
            height: '50vh',
            backgroundColor: activeColor,
            filter: 'blur(10vh)',
            borderRadius: '50%',
            pointerEvents: 'none',
            transition: 'background-color 0.5s ease',
            '@media (min-width: 600px)': {
            width: '50vw',
            },
          }}
        />
        <Box
          sx={{
            width: '100%',
            height: '90%', // Ensures the Slider container takes up 90% of the height
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end', // Aligns Slider to the bottom
            overflow: 'hidden',
          }}
        >
          <Slider {...settings}>
            {genres.map((genre, index) => (
              <div key={index} style={{ height: '100%' }}> {/* Ensure each slide takes full height */}
                <Box
                  sx={{
                    height: '90%', // Box for genre text with height of 90%
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: '#ffffff', fontFamily: 'Spotify, sans-serif' }}
                  >
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </Typography>
                </Box>
              </div>
            ))}
          </Slider>
        </Box>
      </Box>
      <Fab
        color="primary"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
        onClick={handleOpenModal}
      >
        <AddIcon />
      </Fab>
      {/* Book Modal */}
      <BookModal open={isModalOpen} handleClose={handleCloseModal} />
    </Box>
  );
};
