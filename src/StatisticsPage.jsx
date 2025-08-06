import React, { useState, useEffect } from 'react';
import { Log } from './utils/logger';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const API_BASE_URL = '/api';

const StatisticsPage = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        Log('error', 'Fetching stats failed: No access token available.');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/stats`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStats(data);
        Log('info', 'Statistics fetched successfully.');
      } catch (error) {
        Log(`'error', API error during stats fetch: ${error.message}`);
        setStats([]);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ mt: 6, maxWidth: '95%', mx: 'auto' }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        URL Statistics
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Short URL</strong></TableCell>
              <TableCell><strong>Original URL</strong></TableCell>
              <TableCell><strong>Clicks</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell><strong>Expires At</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.length > 0 ? (
              stats.map((stat) => (
                <TableRow key={stat.shortUrl}>
                  <TableCell>
                    <a
                      href={stat.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#1976d2',
                        textDecoration: 'none',
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.textDecoration = 'underline')
                      }
                      onMouseOut={(e) =>
                        (e.target.style.textDecoration = 'none')
                      }
                    >
                      {stat.shortUrl}
                    </a>
                  </TableCell>
                  <TableCell>{stat.originalUrl}</TableCell>
                  <TableCell>{stat.totalClicks}</TableCell>
                  <TableCell>
                    {new Date(stat.creationDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(stat.expiryDate).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No statistics found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StatisticsPage;
