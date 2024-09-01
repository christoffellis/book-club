import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { styled } from '@mui/system';
import { BarcodeScanner } from './BarcodeScanner';
import { BookInfo } from './BookInfo';
import { useAddBookToShelf } from '../common/useAddBookToShelf';
import { useBookshelves } from '../common/useBookshelves';
import { useToken } from '../providers';

// Styled components for dark theme
const DarkDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
  },
}));

const DarkButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  borderColor: '#ffffff',
}));

export const BookModal = ({
  open,
  handleClose,
}) => {

  const {token} = useToken();

  const [barcode, setBarcode] = React.useState(null);

  const{ bookshelves } = useBookshelves(token); 
  const { addBookToShelf } = useAddBookToShelf(token);

  return (
    <DarkDialog open={open} onClose={handleClose}>
      <DialogTitle>Add a Book</DialogTitle>
      <DialogContent>
        <BarcodeScanner
          barcode={barcode}
          setBarcode={setBarcode}
        />
        <BookInfo
          barcode={barcode}
          addToShelf={addBookToShelf}
          bookshelfID={bookshelves.id}
        />
      </DialogContent>
      <DialogActions>
        <DarkButton onClick={handleClose} variant="outlined">
          Cancel
        </DarkButton>
        <DarkButton onClick={() => {}} variant="contained">
          Add
        </DarkButton>
      </DialogActions>
    </DarkDialog>
  );
};
