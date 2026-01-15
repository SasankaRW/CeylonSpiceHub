import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// Get Cloudinary Signature
router.post('/sign', (req, res) => {
    try {
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!apiSecret) {
            console.error('Missing CLOUDINARY_API_SECRET');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const timestamp = Math.round((new Date()).getTime() / 1000);

        // Signature is created by hashing the parameters + exact timestamp + api_secret
        // For a simple upload, we only need timestamp (and any eager/transformation params if used)
        const paramsToSign = `timestamp=${timestamp}`;

        const signature = crypto
            .createHash('sha1')
            .update(paramsToSign + apiSecret)
            .digest('hex');

        res.json({
            signature,
            timestamp,
            apiKey: process.env.CLOUDINARY_API_KEY
        });
    } catch (error) {
        console.error('Error generating signature:', error);
        res.status(500).json({ message: 'Failed to generate signature' });
    }
});

export default router;
