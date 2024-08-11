import React from 'react';
import { SearchBookPage } from './scenes/SearchBookPage';
import { AppBar } from './components/AppBar';

export const App = () => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [token, setToken] = React.useState(false);

  return (
    <div>
      <AppBar
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        token={token}
        setToken={setToken}
      />
      <SearchBookPage
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        token={token}
        setToken={setToken}
      />
    </div>
  );
};
