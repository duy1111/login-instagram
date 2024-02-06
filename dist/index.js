"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
const instagramClientId = '763770962308437';
const instagramClientSecret = 'd1cb16cafda596e82ae09059e705e9a2';
const instagramRedirectUri = 'http://localhost:3000/auth/instagram/callback';
// Define authorization endpoint
app.get('/auth/instagram', (req, res) => {
    const authorizationUrl = `https://www.instagram.com/oauth/authorize?client_id=${instagramClientId}&redirect_uri=${instagramRedirectUri}&response_type=code&scope=user_profile`;
    res.redirect(authorizationUrl);
});
// Callback endpoint after Instagram has authenticated the user
app.get('/auth/instagram/callback', async (req, res) => {
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
        const tokenResponse = await axios_1.default.post(tokenUrl, null, { params: tokenParams });
        const accessToken = tokenResponse.data.access_token;
        // Use the accessToken to fetch user data
        const userDataResponse = await axios_1.default.get(`https://graph.instagram.com/v12.0/me?fields=id,username&access_token=${accessToken}`);
        const userData = userDataResponse.data;
        // Handle the user data as needed (e.g., store it in your database or return it)
        res.json(userData);
    }
    catch (error) {
        console.error('Error exchanging code for access token:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
