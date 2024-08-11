import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { styled } from '@mui/system';
import { BarcodeScanner } from './BarcodeScanner';
import { BookInfo } from './BookInfo';

// Styled components for dark theme
const DarkDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1a1a', // Dark background
    color: '#ffffff', // White text
  },
}));

const DarkButton = styled(Button)(({ theme }) => ({
  color: '#ffffff', // White text
  borderColor: '#ffffff', // White border
}));

export const BookModal = ({ open, handleClose }) => {
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Book Title:', bookTitle);
    console.log('Book Author:', bookAuthor);
    // Reset form fields
    setBookTitle('');
    setBookAuthor('');
    handleClose(); // Close the modal
  };

  return (
    <DarkDialog open={open} onClose={handleClose}>
      <DialogTitle>Add a Book</DialogTitle>
      <DialogContent>
        <BarcodeScanner />
        <BookInfo />
      </DialogContent>
      <DialogActions>
        <DarkButton onClick={handleClose} variant="outlined">
          Cancel
        </DarkButton>
        <DarkButton onClick={handleSubmit} variant="contained">
          Add
        </DarkButton>
      </DialogActions>
    </DarkDialog>
  );
};
