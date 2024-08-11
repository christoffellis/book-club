// BarcodeScanner.js
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const BarcodeScanner = ({
    setBarcode,
    barcode
}) => {
  const webcamRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const scanBarcode = () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          codeReader.decodeFromImageUrl(imageSrc)
            .then(result => {
              setBarcode(result.text);
            })
            .catch(err => {
              if (!(err instanceof NotFoundException)) {
                setError('Error scanning barcode');
              }
            });
        }
      }
    };

    const intervalId = setInterval(scanBarcode, 100); // Scan every second

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return (
    <div>
      <h1>Barcode Scanner</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="40%"
        height="30%"
      />
      <div>
        <p><strong>Scanned Barcode:</strong> {barcode}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default BarcodeScanner;
