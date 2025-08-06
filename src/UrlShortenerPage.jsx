import React, { useState } from 'react';
import { Log } from './utils/logger';
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Container,
} from '@mui/material';

const API_BASE_URL = '/api';

const UrlShortenerPage = () => {
  const [url, setUrl] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [error, setError] = useState('');

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('URL cannot be empty');
      return;
    }

    if (!validateUrl(url)) {
      setError('Invalid URL format');
      Log(`'error', Invalid URL format submitted: ${url}`);
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      Log('fatal', 'API call failed: No access token available.');
      return;
    }

    const payload = [{ originalUrl: url }];

    try {
      const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      setShortenedUrls((prev) => [...prev, ...data]);
      setUrl('');
      Log(`'info', Successfully shortened URL.`);
    } catch (error) {
      Log(`'error', API error during URL shortening: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 6, boxShadow: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h4" component="h2" gutterBottom align="center">
              Shorten Your URL
            </Typography>

            <TextField
              fullWidth
              label="Enter URL"
              value={url}
              onChange={handleChange}
              error={!!error}
              helperText={error}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Shorten
            </Button>
          </Box>
        </CardContent>
      </Card>

      {shortenedUrls.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Shortened URLs:
          </Typography>
          {shortenedUrls.map((link, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1">
                  Original: {link.originalUrl}
                </Typography>
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{
                    '& a': {
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { textDecoration: 'underline' },
                    },
                  }}
                >
                  Short:{' '}
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.shortUrl}
                  </a>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Expires: {new Date(link.expiryDate).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default UrlShortenerPage;
