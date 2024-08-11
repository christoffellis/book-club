import React, { useRef, useState, useEffect } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import BookInfo from './components/BookInfo';
import { SearchBookPage } from './scenes/SearchBookPage';

export const App = () => {
  
  const [barcode, setBarcode] = React.useState(null);

  return (
    <div>
     
      <SearchBookPage />
      {/* <BarcodeScanner
        barcode={barcode}
        setBarcode={setBarcode}
      />

      <BookInfo
        barcode={barcode}
      /> */}
    </div>
  );
};
