import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const instagramClientId = '718182019755791';
const instagramClientSecret = 'your-instagram-client-secret';
const instagramRedirectUri = 'http://localhost:3000/auth/instagram/callback';

// Define authorization endpoint
app.get('/auth/instagram', (req: Request, res: Response) => {
  const authorizationUrl = `https://www.instagram.com/oauth/authorize?client_id=${instagramClientId}&redirect_uri=${instagramRedirectUri}&response_type=code&scope=user_profile`;

  res.redirect(authorizationUrl);
});

// Callback endpoint after Instagram has authenticated the user
app.get('/auth/instagram/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  // Exchange the code for an access token
  const tokenUrl = 'https://api.instagram.com/oauth/access_token';
  const tokenParams = {
    client_id: instagramClientId,
    client_secret: instagramClientSecret,
    grant_type: 'authorization_code',
    redirect_uri: instagramRedirectUri,
    code,
  };

  try {
    const tokenResponse = await axios.post(tokenUrl, null, { params: tokenParams });
    const accessToken = tokenResponse.data.access_token;

    // Use the accessToken to fetch user data
    const userDataResponse = await axios.get(`https://graph.instagram.com/v12.0/me?fields=id,username&access_token=${accessToken}`);
    const userData = userDataResponse.data;

    // Handle the user data as needed (e.g., store it in your database or return it)
    res.json(userData);
  } catch (error: any) {
    console.error('Error exchanging code for access token:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
