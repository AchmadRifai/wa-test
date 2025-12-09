import { SendWaReq } from '@/dto';
import { sock, waConnected } from '@/wa';
import express from 'express';
import { ZodError } from 'zod';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        if (!sock || !waConnected) {
            return res.status(500).json({ message: 'WA not connected' });
        }
        const body = await SendWaReq.parseAsync(req.body);
        await sock.sendMessage(body.target, { text: body.textMessage });
        res.json({ message: 'message sent' });
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({ constraint: e.issues });
        }
        console.error(e);
        return res.status(500).json({ message: 'Internal error' });
    }
});

export default router;