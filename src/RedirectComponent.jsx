import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Log } from './utils/logger';
import { Typography, Box } from '@mui/material';

const API_BASE_URL = '/api';

const RedirectComponent = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    const redirectToUrl = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        Log(`'error', Redirection failed for shortcode ${shortcode}: No access token available.`);
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/redirect/${shortcode}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to redirect');
        }

        const data = await response.json();
        Log(`'info', Redirecting from ${shortcode} to ${data.originalUrl}.`);
        window.location.href = data.originalUrl;
      } catch (error) {
        Log(`'fatal', Redirection error for shortcode ${shortcode}: ${error.message}`);
      }
    };
    
    if (shortcode) {
      redirectToUrl();
    }
  }, [shortcode]);

  return (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h5">
        Redirecting...
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        If you are not redirected automatically, please check your shortcode.
      </Typography>
    </Box>
  );
};

export default RedirectComponent;