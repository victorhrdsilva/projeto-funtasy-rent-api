import express from 'express';
import {getCustomers, newCustomer, getCustomersById} from '../controllers/customersControllers.js'
import { validateSchema } from '../middlewares/validateBody.js';
import { boardGameSchema } from '../schemas/boardGameSchema.js';

const router = express.Router();

router.post('/customers',validateSchema(boardGameSchema), newCustomer);

router.get('/customers', getCustomers);

router.get('/customers/:id', getCustomersById);

export default router;