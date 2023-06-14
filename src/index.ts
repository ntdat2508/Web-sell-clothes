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
import expressLayouts from 'express-ejs-layouts';
dotenv.config();
// const expressLayout = require('express-ejs-layouts');
/**
 * App Variables
 */
if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
/**
 *  App Configuration
 */
const app = express();

//setlayouts
app.use(expressLayouts);
// app.set('layout','layouts/layout');
//view ejs
app.set('view engine', 'ejs');
//
app.set('views', path.join(__dirname, 'views/items'));
app.use('/', express.static(path.join(__dirname, '../public')));
app.use(helmet());
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use('/', itemsRouter);

// app.set('/', 'layouts/layout');



app.use(errorHandler);
app.use(notFoundHandler);

/**
 * Server Activation
 */
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
