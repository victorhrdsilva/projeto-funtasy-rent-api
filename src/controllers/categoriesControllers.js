import connection from '../db/db.js';
import { STATUS_CODE } from '../enums/statusCode.js';

const getCategories = async (req, res) => {
    try {
        const categoriesList = await connection.query('SELECT * FROM categories;');
        res.send(categoriesList.rows);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };
};

const newCategorie = async (req, res) => {
    const { name } = req.body;
    try {
        let existCategorie = await connection.query('SELECT * FROM categories WHERE "name" = $1;', [name]);
        if (existCategorie.rows.length > 0) {
            return res.status(STATUS_CODE.CONFLICT).send('Categoria já existe');
        }

        await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
        return res.sendStatus(STATUS_CODE.CREATED);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };

};

export { getCategories, newCategorie };