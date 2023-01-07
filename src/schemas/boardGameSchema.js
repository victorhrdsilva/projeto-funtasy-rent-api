import joi from "joi";

const boardGameSchema = joi.object({
    name: joi.string().required().empty(' '),
    image: joi.string().required().uri(),
    stockTotal: joi.number().required().min(1),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().required().min(1)
});

export { boardGameSchema };