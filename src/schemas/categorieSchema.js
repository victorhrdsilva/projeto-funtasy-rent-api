import joi from "joi";

const categorieNameSchema = joi.object({
    name: joi.string().required().empty(' '),
});

export { categorieNameSchema };