import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "D8@dm1n15",
    database: "postgres",
    synchronize: true,
    logging: false,
    poolSize: 20,
    entities: ['models/**/*.model.ts'],
});