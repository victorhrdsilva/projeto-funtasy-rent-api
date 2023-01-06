import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import categoriesRouters from './routers/categoriesRouters.js'
import boardGamesRouters from './routers/boardGamesRouters.js'
import customersRouters from './routers/customersRouters.js'

import connection from './db/db.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

//Categories routers
app.use(categoriesRouters);

//Board Game routers
app.use(boardGamesRouters);

//Board Game routers
app.use(customersRouters);

app.listen(process.env.PORT || 4000, () => console.log(`App running in port: ${process.env.PORT}`));