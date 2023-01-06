import express from 'express';
import {getCategories, newCategory} from '../controllers/categoriesControllers.js' 
import { validateSchema } from '../middlewares/validateBody.js';
import { customerSchema } from '../schemas/customerSchema.js';

const router = express.Router();

router.get('/categories', getCategories);


router.post('/categories', validateSchema(customerSchema), newCategory);


export default router;