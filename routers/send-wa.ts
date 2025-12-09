import { sock, waConnected } from '@/wa';
import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        if (!sock || !waConnected) {
            return res.status(500).json({ message: 'WA not connected' });
        }
        const body = req.body;
        await sock.sendMessage(body.target, { text: body.textMessage });
        res.json({ message: 'message sent' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Internal error' });
    }
});

export default router;