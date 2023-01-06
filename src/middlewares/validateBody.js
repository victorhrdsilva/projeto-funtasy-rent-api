import { STATUS_CODE } from "../enums/statusCode.js";

export function validateSchema(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false });
        if (validation.error) {
            const erros = validation.error.details.map(
                (details) => details.message
            );
            return res.status(STATUS_CODE.UNPROCESSABLE_ENTITY).send(erros);
        }
        next();
    };
}