import joi from "joi";

const rentalSchema = joi.object({
    customerId: joi.number().required().min(1),
    boardGameId: joi.number().required().min(1),
    daysRented: joi.number().required().min(1),
});

export { rentalSchema };