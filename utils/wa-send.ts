import { SendWaReq } from "@/dto";
import { getRepository } from "@/models";
import { WaMessage } from "@/models/wa-message.model";
import { sock, waConnected } from "@/wa";
import { sleep } from "bun";

interface WaSendingReq {
    id: number;
}

export const waSending = async (msg: string) => {
    while (!sock || !waConnected) { }
    console.log(msg);
    const req: WaSendingReq = JSON.parse(msg);
    const messageRepo = getRepository(WaMessage);
    const message = await messageRepo.findOneByOrFail({ id: req.id });
    const body = await SendWaReq.parseAsync(JSON.parse(message.value));
    await sock.sendMessage(body.target, { text: body.textMessage });
    await sleep(1000 * 10);
};
