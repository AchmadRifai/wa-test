import "reflect-metadata";
import app from '@/routers';
import { AppDataSource } from "./db";
import { connctWa } from "./wa";
import { consuming } from "./kafka";
import { waSending } from "./utils/wa-send";

await AppDataSource.initialize();
console.log("Hello via Bun!");
connctWa().catch(console.log);
consuming('wa-sending', waSending).catch(console.log);

const PORT = process.env.PORT || '3000';

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
