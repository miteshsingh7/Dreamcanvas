import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute (allows 15 generations of 4 images each)
  message: { error: 'Too many images generated from this IP, please try again after a minute' },
  standardHeaders: true, 
  legacyHeaders: false,
  skipFailedRequests: true, // If you reload the page before images generate, it won't count against your limit
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(cors());
app.use(express.json());

// API Endpoint to proxy requests to Cloudflare Workers AI
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const cfAccountId = process.env.CF_ACCOUNT_ID;
  const cfToken = process.env.CF_API_TOKEN;

  if (!cfAccountId || !cfToken) {
    console.error('Missing Cloudflare credentials in environment variables.');
    return res.status(500).json({ error: 'Server misconfiguration: Missing API credentials' });
  }

  const MODEL = '@cf/bytedance/stable-diffusion-xl-lightning';
  const URL_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/${MODEL}`;

  try {
    const response = await fetch(URL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudflare API Error:', response.status, errorText);
      return res.status(response.status).json({ error: `Cloudflare API Error: ${response.status}` });
    }

    // Cloudflare returns an image binary. We forward it directly to the client.
    const buffer = await response.arrayBuffer();
    
    // Set appropriate headers for the image response
    res.set('Content-Type', 'image/jpeg');
    res.set('Content-Length', buffer.byteLength);
    res.send(Buffer.from(buffer));
    
  } catch (err) {
    console.error('Error connecting to Cloudflare:', err);
    res.status(500).json({ error: 'Failed to connect to Cloudflare Workers AI' });
  }
});

// Serve static frontend files
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all route to serve the React frontend for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend proxy server running on port ${PORT}`);
});
