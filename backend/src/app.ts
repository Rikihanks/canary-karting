import express from 'express';
import cors from 'cors';
import db, { initDatabase } from './db.js';
import dataRouter from './routes/data.js';
import resultsRouter from './routes/results.js';
import manageRouter from './routes/manage.js';
import schemaRouter from './routes/schema.js';
import { initBot } from './services/telegram.js';
import { startRaceCheck } from './cron/raceCheck.js';

const app = express();

app.use(cors());
app.use(express.json());

initDatabase();
initBot();
startRaceCheck();

app.use(dataRouter);
app.use(resultsRouter);
app.use(manageRouter);
app.use(schemaRouter);

export default app;
