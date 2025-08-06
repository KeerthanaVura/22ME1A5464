import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Log } from './utils/logger';
import { fetchToken } from './utils/auth';
import UrlShortenerPage from './UrlShortenerPage';
import StatisticsPage from './StatisticsPage';
import RedirectComponent from './RedirectComponent';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

function App() {
  const [tokenLoaded, setTokenLoaded] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const token = await fetchToken();
      if (token) {
        setTokenLoaded(true);
        Log('info', 'Application started and token fetched successfully.');
      } else {
        setTokenLoaded(false);
        Log('fatal', 'Application failed to start due to authentication error.');
      }
    };
    getToken();
  }, []);

  if (!tokenLoaded) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '50px' }}>
        <Typography variant="h5">
          Loading... Please check the browser console for authentication errors.
        </Typography>
      </Container>
    );
  }

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">Shortener</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<UrlShortenerPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/:shortcode" element={<RedirectComponent />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;