import { SendWaReq } from '@/dto';
import { producing } from '@/kafka';
import { getRepository } from '@/models';
import { WaMessage } from '@/models/wa-message.model';
import { sock, waConnected } from '@/wa';
import express from 'express';
import { ZodError } from 'zod';

const router = express.Router();

router.post('/', async (req, res) => {
    const messageRepo = getRepository(WaMessage);
    try {
        if (!sock || !waConnected) {
            return res.status(500).json({ message: 'WA not connected' });
        }
        const body = await SendWaReq.parseAsync(req.body);
        //await sock.sendMessage(body.target, { text: body.textMessage });
        let message = messageRepo.create({ value: JSON.stringify(body) });
        message = await messageRepo.save(message);
        await producing('wa-sending', JSON.stringify({ id: message.id }));
        res.json({ message: 'message queued' });
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).json({ constraint: e.issues });
        }
        console.error(e);
        return res.status(500).json({ message: 'Internal error' });
    }
});

export default router;