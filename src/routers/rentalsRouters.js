import express from 'express';
import { validateSchema } from '../middlewares/validateBody.js';
import { getRentals, newRental, returnRental, deleteRental } from '../controllers/rentalsControllers.js';
import { rentalSchema } from '../schemas/rentalSchema.js';

const router = express.Router();

router.post('/rentals',validateSchema(rentalSchema), newRental);
router.post('/rentals/:id/return', returnRental);

router.get('/rentals', getRentals);

router.delete('/rentals/:id', deleteRental);

export default router;