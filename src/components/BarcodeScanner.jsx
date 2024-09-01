import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { styled } from '@mui/system';

// Styled components for dark theme
const DarkDialog = styled('div')(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: '16px',
  borderRadius: '8px',
}));

const DarkButton = styled('button')(({ theme }) => ({
  color: '#ffffff',
  borderColor: '#ffffff',
  backgroundColor: 'transparent',
  border: '1px solid',
  padding: '8px 16px',
  cursor: 'pointer',
}));

export const BarcodeScanner = ({ setBarcode, barcode }) => {
  const webcamRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState('');
  const [error, setError] = useState('');

  const handleDevices = useCallback(
    mediaDevices => {
      const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput');
      setDevices(videoDevices);

     
      if (videoDevices.length > 0 && !currentDeviceId) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }
    },
    [currentDeviceId]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

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

    const intervalId = setInterval(scanBarcode, 100);

    return () => clearInterval(intervalId);
  }, [setBarcode]);

  const handleClick = () => {
    if (devices.length > 0) {
     
      const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);

     
      const nextIndex = (currentIndex + 1) % devices.length;
      setCurrentDeviceId(devices[nextIndex].deviceId);
    }
  };

  return (
    <DarkDialog>
      <h1>Barcode Scanner</h1>
      <div onClick={handleClick} style={{ cursor: 'pointer', width: '100%', height: 'auto' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ deviceId: currentDeviceId }}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div>
        <p><strong>Scanned Barcode:</strong> {barcode}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div>
        <DarkButton onClick={handleClick}>Switch Camera</DarkButton>
      </div>
    </DarkDialog>
  );
};
