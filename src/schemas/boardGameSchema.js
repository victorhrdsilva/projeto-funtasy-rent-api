import joi from "joi";

const boardGameSchema = joi.object({
    name: joi.string().required().empty(' '),
    image: joi.string().required().uri(),
    stockTotal: joi.number().required().min(1).empty(' '),
    categoryId: joi.number().required().empty(' '),
    pricePerDay: joi.number().required().min(1).empty(' ')
});

export { boardGameSchema };