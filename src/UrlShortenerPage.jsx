import React, { useState } from 'react';
import { Log } from './utils/logger';
import { TextField, Button, Box, Typography, Card, CardContent } from '@mui/material';

const API_BASE_URL = 'http://localhost:3000'; 

const UrlShortenerPage = () => {
  const [urls, setUrls] = useState(['', '', '', '', '']);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleChange = (e, index) => {
    const newUrls = [...urls];
    newUrls[index] = e.target.value;
    setUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validUrls = urls.filter(url => url.trim() !== '');
    const newErrors = {};
    validUrls.forEach((url, index) => {
      if (!validateUrl(url)) {
        newErrors[index] = 'Invalid URL format';
        Log(`'error', Invalid URL format submitted: ${url}`);
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      Log('fatal', 'API call failed: No access token available.');
      return;
    }
    
    const payload = validUrls.map(url => ({ originalUrl: url }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL(s)');
      }

      const data = await response.json();
      setShortenedUrls(data);
      Log(`'info', Successfully shortened ${data.length} URL(s).`);

    } catch (error) {
      Log(`'error', API error during URL shortening: ${error.message}`);
      setShortenedUrls([]);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Shorten Your URLs
      </Typography>
      {urls.map((url, index) => (
        <TextField
          key={index}
          margin="normal"
          fullWidth
          label={URL `${index + 1}`}
          value={url}
          onChange={(e) => handleChange(e, index)}
          error={!!errors[index]}
          helperText={errors[index]}
        />
      ))}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Shorten
      </Button>

      {shortenedUrls.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Shortened URLs:
          </Typography>
          {shortenedUrls.map((link, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1">
                  Original: {link.originalUrl}
                </Typography>
                <Typography variant="body1" color="primary">
                  Short: <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">{link.shortUrl}</a>
                </Typography>
                <Typography variant="caption">
                  Expires: {new Date(link.expiryDate).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UrlShortenerPage;