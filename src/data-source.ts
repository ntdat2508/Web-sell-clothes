import { DataSource } from 'typeorm';
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'clothes',
    synchronize: true,
    logging: true,
    entities: ['src/entity/*.ts'],
    subscribers: [],
    migrations: [],
});
