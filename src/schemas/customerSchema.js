import joi from "joi";

const customerSchema = joi.object({
    name: joi.string().required().empty(' '),
    phone: joi.string().required().min(10).max(11),
    cpf: joi.string().required().length(11),
    birthday: joi.date().required(),
});

export { customerSchema };