const logEndpoint = 'http://20.244.56.144/evaluation-service/logs';

export const Log = async (level, message) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('Logging failed: No access token available.');
    return;
  }

  try {
    const response = await fetch(logEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, 
      },
      body: JSON.stringify({
        stack: 'frontend',
        level: level,
        package: 'api',
        message: message,
      }),
    });

    if (!response.ok) {
      console.error(`Failed to send log to server. Status: ${response.status}`);
    }

  } catch (error) {
    console.error('Error while sending log:', error);
  }
};