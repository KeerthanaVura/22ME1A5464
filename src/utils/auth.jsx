const authEndpoint = '/api/auth';
const authPayload = {
  email: 'vuravarshini@gmail.com',
  name: 'Vura Keerthana Sri Varshini',
  rollNo: '22ME1A5464',
  accessCode: 'CcbjcK',
  clientID: '2d9afed2-df31-4c64-9fcb-00279b6e27d0',
  clientSecret: 'gFkGKmTNmETcRqGU'
};

export const fetchToken = async () => {
  try {
    const response = await fetch(authEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authPayload),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch access token');
    }

    const data = await response.json();
    const accessToken = data.access_token;
    localStorage.setItem('accessToken', accessToken);
    console.log('Access token fetched and stored.');
    return accessToken;
  } catch (error) {
    console.error('Error during authentication:', error);
    return null;
  }
};