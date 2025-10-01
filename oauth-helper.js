require('dotenv').config();
const express = require('express');
const { randomBytes } = require('crypto');

const app = express();
const port = 3000;

// OAuth configuration
const CLIENT_ID = process.env.SQUARE_APPLICATION_ID;
const CLIENT_SECRET = process.env.SQUARE_APPLICATION_SECRET; // We'll need this
const REDIRECT_URI = 'http://localhost:3000/callback';
const ENVIRONMENT = process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox';

// Base URLs for Square OAuth
const OAUTH_BASE_URL = ENVIRONMENT === 'production' 
  ? 'https://connect.squareup.com/oauth2'
  : 'https://connect.squareupsandbox.com/oauth2';

console.log('🔧 Square OAuth Helper for Apollo Jewelry');
console.log('==========================================');
console.log(`Environment: ${ENVIRONMENT}`);
console.log(`App ID: ${CLIENT_ID}`);
console.log(`Redirect URI: ${REDIRECT_URI}`);
console.log('');

// Generate state parameter for security
const state = randomBytes(16).toString('hex');

// Step 1: Authorization URL
const authUrl = `${OAUTH_BASE_URL}/authorize?` +
  `client_id=${CLIENT_ID}&` +
  `scope=MERCHANT_PROFILE_READ+ITEMS_READ+ITEMS_WRITE&` +
  `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
  `session=false&` +
  `state=${state}`;

// Start server
app.get('/', (req, res) => {
  res.send(`
    <h1>Square OAuth for Apollo Jewelry</h1>
    <p>Click the button below to authorize your Square application:</p>
    <a href="${authUrl}" style="
      background: #0066cc; 
      color: white; 
      padding: 15px 30px; 
      text-decoration: none; 
      border-radius: 5px;
      display: inline-block;
      font-size: 16px;
    ">Authorize Square Access</a>
    <p><small>This will redirect you to Square, then back to get your access token.</small></p>
  `);
});

// Step 2: Handle callback
app.get('/callback', async (req, res) => {
  const { code, state: returnedState } = req.query;
  
  if (returnedState !== state) {
    return res.status(400).send('Invalid state parameter');
  }
  
  if (!code) {
    return res.status(400).send('Authorization code not received');
  }
  
  try {
    console.log('📝 Received authorization code, exchanging for access token...');
    
    // Exchange code for access token
    const tokenResponse = await fetch(`${OAUTH_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.access_token) {
      console.log('✅ ACCESS TOKEN RECEIVED!');
      console.log('Token:', tokenData.access_token);
      console.log('');
      console.log('🔧 Update your .env file with:');
      console.log(`SQUARE_ACCESS_TOKEN=${tokenData.access_token}`);
      
      res.send(`
        <h1>✅ Success!</h1>
        <h2>Your Square Access Token:</h2>
        <p><code style="background: #f0f0f0; padding: 10px; display: block; margin: 10px 0;">${tokenData.access_token}</code></p>
        <p><strong>Next steps:</strong></p>
        <ol>
          <li>Copy the access token above</li>
          <li>Update your .env file with the new token</li>
          <li>Run the hidden attributes creator</li>
        </ol>
        <p><small>You can close this browser window after copying the token.</small></p>
      `);
      
    } else {
      console.error('❌ Token exchange failed:', tokenData);
      res.status(400).send(`Token exchange failed: ${JSON.stringify(tokenData)}`);
    }
    
  } catch (error) {
    console.error('❌ OAuth error:', error.message);
    res.status(500).send(`OAuth error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log('🌐 OAuth server running at:');
  console.log(`   http://localhost:${port}`);
  console.log('');
  console.log('📋 Steps:');
  console.log('1. Open the URL above in your browser');
  console.log('2. Click "Authorize Square Access"');
  console.log('3. Authorize your app in Square');
  console.log('4. Copy the access token from the success page');
  console.log('5. Update .env file with the new token');
  console.log('');
  console.log('⚠️  Make sure you have SQUARE_APPLICATION_SECRET in your .env file!');
});