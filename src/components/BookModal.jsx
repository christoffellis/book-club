import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { BarcodeScanner } from './BarcodeScanner';
import { BookInfo } from './BookInfo';

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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add a Book</DialogTitle>
      <DialogContent>
        <BarcodeScanner />

        <BookInfo/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

