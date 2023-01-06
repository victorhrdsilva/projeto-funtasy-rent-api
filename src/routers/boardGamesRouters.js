import express from 'express';
import {getBoardGames, newBoardGame} from '../controllers/boardGamesControllers.js'
import { validateSchema } from '../middlewares/validateBody.js';
import { boardGameSchema } from '../schemas/boardGameSchema.js';

const router = express.Router();

router.post('/boardgames',validateSchema(boardGameSchema), newBoardGame);

router.get('/boardgames', getBoardGames);

export default router;