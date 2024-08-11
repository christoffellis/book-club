// AppBar.js
import React from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { Box, IconButton, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useBookshelves } from '../common/useBookshelves';

export const AppBar = ({
  loggedIn,
  setLoggedIn,
  token,
  setToken
}) => {


  // Hook to manage Google login
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/books',
    onSuccess: (tokenResponse) => {
      // Handle the token or user information after successful login
      console.log('User logged in:', tokenResponse);
      setToken(tokenResponse.access_token);

      setLoggedIn(true);
    },
    onError: (error) => {
      console.error('Login error:', error);
      setLoggedIn(false);
    },
  });

  // Hook to manage Google logout
  const signOut = googleLogout({
    onLogoutSuccess: () => {
      console.log('User logged out');
      setLoggedIn(false);
    },
  });

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
          <IconButton onClick={() => googleLogout()} color="inherit">
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
