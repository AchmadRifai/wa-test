import "reflect-metadata";
import { AppDataSource } from "./db";
import { listenWaVersion } from "./wa";

await AppDataSource.initialize();
listenWaVersion().catch(console.log);
console.log("Hello via Bun!");