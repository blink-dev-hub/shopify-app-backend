import crypto from 'crypto';

export default function handler(req, res) {
  const shopifySecret = process.env.SHOPIFY_API_SECRET; // Set this in your Vercel environment variables

  // Get the HMAC from the header
  const hmacHeader = req.headers['x-shopify-hmac-sha256'];

  // Get the raw body as a string
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    // Calculate the HMAC
    const generatedHmac = crypto
      .createHmac('sha256', shopifySecret)
      .update(data, 'utf8')
      .digest('base64');

    // Compare HMACs
    if (generatedHmac === hmacHeader) {
      res.status(200).send('OK');
    } else {
      res.status(401).send('HMAC validation failed');
    }
  });
}