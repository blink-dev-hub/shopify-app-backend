import crypto from 'crypto';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    const secret = process.env.SHOPIFY_API_SECRET;
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];

    // Read raw body
    let data = '';
    await new Promise((resolve) => {
        req.on('data', (chunk) => {
        data += chunk;
        });
        req.on('end', resolve);
    });

    // Calculate HMAC
    const generatedHmac = crypto
        .createHmac('sha256', secret)
        .update(data, 'utf8')
        .digest('base64');

    // Compare HMACs
    if (generatedHmac === hmacHeader) {
        res.status(200).send('OK');
    } else {
        res.status(401).send('HMAC validation failed');
    }
}