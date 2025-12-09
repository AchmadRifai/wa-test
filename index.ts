import "reflect-metadata";
import { AppDataSource } from "./db";
import { connctWa } from "./wa";

await AppDataSource.initialize();
console.log("Hello via Bun!");
connctWa().catch(console.log);
