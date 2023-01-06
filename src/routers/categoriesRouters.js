import express from 'express';
import {getCategories, newCategorie} from '../controllers/categoriesControllers.js' 
import { validateSchema } from '../middlewares/validateBody.js';
import { categorieNameSchema } from '../schemas/categorieSchema.js';

const router = express.Router();

router.get('/categories', getCategories);


router.post('/categories', validateSchema(categorieNameSchema), newCategorie);


export default router;