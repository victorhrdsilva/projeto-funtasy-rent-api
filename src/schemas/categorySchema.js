import joi from "joi";

const categoryNameSchema = joi.object({
    name: joi.string().required().empty(' '),
});

export { categoryNameSchema };