import React from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Box, IconButton, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useToken } from '../providers';

export const AppBar = () => {
  const { loggedIn, setLoggedIn, setToken } = useToken();

 
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/books https://www.googleapis.com/auth/drive.file',
    onSuccess: (tokenResponse) => {
      console.log('User logged in:', tokenResponse);
      setToken(tokenResponse.access_token);
      setLoggedIn(true);
    },
    onError: (error) => {
      console.error('Login error:', error);
      setLoggedIn(false);
    },
  });

 
  const signOut = () => {
    googleLogout();
    setLoggedIn(false);
    setToken(null);
    console.log('User logged out');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px',
        position: 'relative',
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        My Library
      </Typography>
      {/* Conditional rendering based on whether the user is logged in */}
      {loggedIn ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Assuming login.profileObj contains the user profile information */}
          <img
            src={login.profileObj?.picture}
            alt="User Profile"
            style={{
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              marginRight: '10px',
            }}
          />
          <IconButton onClick={signOut} color="inherit">
            Sign Out
          </IconButton>
        </Box>
      ) : (
        <IconButton onClick={() => login()} color="inherit">
          <Google />
        </IconButton>
      )}
    </Box>
  );
};
