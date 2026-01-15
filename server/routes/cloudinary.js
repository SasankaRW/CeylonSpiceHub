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

// Delete Image
router.post('/delete', async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({ message: 'Missing public_id' });
        }

        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;

        if (!apiSecret || !apiKey || !cloudName) {
            return res.status(500).json({ message: 'Server configuration error' });
        }

        const timestamp = Math.round((new Date()).getTime() / 1000);

        // Generate signature for destroy
        const paramsToSign = `public_id=${public_id}&timestamp=${timestamp}`;
        const signature = crypto
            .createHash('sha1')
            .update(paramsToSign + apiSecret)
            .digest('hex');

        // Use fetch to call Cloudinary API
        const formData = new URLSearchParams();
        formData.append('public_id', public_id);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);

        const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
            {
                method: 'POST',
                body: formData,
            }
        );

        const data = await cloudinaryRes.json();

        if (data.result !== 'ok' && data.result !== 'not found') {
            console.error('Cloudinary delete error:', data);
            return res.status(500).json({ message: 'Failed to delete image from Cloudinary', error: data });
        }

        res.json({ message: 'Image deleted successfully', result: data });

    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Failed to delete image' });
    }
});

export default router;
