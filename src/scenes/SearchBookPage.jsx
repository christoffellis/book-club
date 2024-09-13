import React, { useState, useEffect, useContext } from 'react';
import { Box, Fab } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import AddIcon from '@mui/icons-material/Add';
import 'slick-carousel/slick/slick-theme.css';
import { BookModal } from '../components/BookModal';
import { useBookshelves } from '../common/useBookshelves';
import { useGetShelfVolumes } from '../common/useGetShelfVolumes';
import { GenreDisplay } from '../components/ViewLibrary/GenreDisplay';
import { BookDisplay } from '../components/BookDisplay/BookDisplay';
import { genreColors } from '../enums';
import { MetadataProvider, useToken } from '../providers';


export const SearchBookPage = () => {
  const {token, loggedIn} = useToken();
  const { bookshelves } = useBookshelves(token); 
  const { booksByGenre, loading: shelfLoading, error: shelfError } = useGetShelfVolumes(token, bookshelves.id);
  
  
  const [selectedGenre, setSelectedGenre] = useState(null);



  const [activeColor, setActiveColor] = useState('#4A148C');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!shelfLoading && !shelfError && booksByGenre) {
     
      const firstGenre = Object.keys(booksByGenre)[0];
      setActiveColor(genreColors[firstGenre] || '#4A148C');
      setSelectedGenre(firstGenre);
    }
  }, [/*booksByGenre,*/ shelfLoading, shelfError]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => {
      const genre = Object.keys(booksByGenre)[next];
      setActiveColor(genreColors[genre] || '#4A148C');
      setSelectedGenre(genre);
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: '#000000',
        height: '92vh',
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
            height: '90%',
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          

          <MetadataProvider
            token={token}
          >
            <BookDisplay
              key={1}
              activeGenre={selectedGenre}
              booksByGenre={booksByGenre}
            />

            <Slider
              key={2}
              {...settings} style={{ width: '80%', height: '80%' }}> {/* Adjust width as needed */}
              {Object.keys(booksByGenre).map((genre, index) => (
                <h1
                  key={index}
                  style={{color: 'white'}}
                >
                  {genre}
                </h1>
              ))}
            </Slider>
          </MetadataProvider>
          
        </Box>
      </Box>

      {loggedIn && (
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
      )}
      <BookModal
        open={isModalOpen}
        handleClose={handleCloseModal}
      />
    </Box>
  );
};
