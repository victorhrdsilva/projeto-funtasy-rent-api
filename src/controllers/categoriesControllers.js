import joi from 'joi';
import connection from '../db/db.js';

const nameSchema = joi.object({
    name: joi.string().required().empty(' '),
});

const getCategories = async (req, res) => {
    try {
        const categoriesList = await connection.query('SELECT * FROM categories;');
        res.send(categoriesList.rows);
    } catch (error) {
        res.status(500).send(error.message);
    };
}

const newCategorie = async (req, res) => {
    const { name } = req.body;

    const newCategorieInformed = { name };

    const validation = nameSchema.validate(newCategorieInformed, {
        abortEarly: false,
    });

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
    };

    try {
        let existCategorie = await connection.query('SELECT * FROM categories WHERE "name" = $1;', [newCategorieInformed.name]);
        if (existCategorie.rows.length > 0) {
            return res.sendStatus(409);
        }

        await await connection.query('INSERT INTO categories (name) VALUES ($1)', [newCategorieInformed.name]);
        return res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    };

};

export { getCategories, newCategorie }