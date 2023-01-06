import express from 'express';
import {newBoardGame, getBoardGames} from '../controllers/boardGamesControllers.js' 

const router = express.Router();

router.post('/boardgames', newBoardGame);

router.get('/boardgames', getBoardGames);

export default router;