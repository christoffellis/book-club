import React from 'react';
import { SearchBookPage } from './scenes/SearchBookPage';
import { AppBar } from './components/AppBar';
import { TokenProvider } from './providers';

export const App = () => {
  return (
    <TokenProvider>
      <div>
        <AppBar />
        <SearchBookPage />
      </div>
    </TokenProvider>
  );
};
