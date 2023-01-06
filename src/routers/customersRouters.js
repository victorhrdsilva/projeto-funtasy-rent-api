import express from 'express';
import {getCustomers, newCustomer, getCustomerById, updateCustomer} from '../controllers/customersControllers.js'
import { validateSchema } from '../middlewares/validateBody.js';
import { boardGameSchema } from '../schemas/boardGameSchema.js';
import { customerSchema } from '../schemas/customerSchema.js';

const router = express.Router();

router.post('/customers',validateSchema(customerSchema), newCustomer);
router.put('/customers/:id',validateSchema(customerSchema), updateCustomer);

router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);

export default router;