import express from 'express';
import {getCategories, newCategorie} from '../controllers/categoriesControllers.js' 

const router = express.Router();

router.post('/categories', newCategorie);

router.get('/categories', getCategories);

export default router;