/**
 * Required External Modules
 */
import path from 'path';
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { itemsRouter } from './items/items.router';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';
import layouts from 'express-ejs-layouts';
dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use('/', itemsRouter);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/items'));
app.use('/', express.static(path.join(__dirname, '../public')));

app.use(layouts);

app.use(errorHandler);
app.use(notFoundHandler);

/**
 * Server Activation
 */
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
