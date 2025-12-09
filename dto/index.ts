import * as z from 'zod';

export const SendWaReq = z.object({
    target: z.string().nonempty().max('6281804804128@s.whatsapp.net'.length + 2).nonoptional(),
    textMessage: z.string().nonempty().nonoptional()
});
