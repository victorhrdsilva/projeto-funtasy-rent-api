import connection from '../db/db.js';
import { STATUS_CODE } from '../enums/statusCode.js';

const getCustomers = async (req, res) => {
    const query = req.query.cpf;

    try {
        let customersList
        if(query !== undefined) {
            customersList = await connection.query('SELECT * FROM "customers" WHERE "customers".cpf ILIKE $1;', [`${query}%`]);
        } else {
            customersList = await connection.query('SELECT * FROM "customers";');
        }

        res.status(STATUS_CODE.OK).send(customersList.rows);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };
};

const getCustomersById = async (req, res) => {
    const id = req.params.id;
    try {
        let customersList = await connection.query('SELECT * FROM "customers" WHERE "customers".id = $1;', [id]);
        if(customersList.rows.length === 0) {
            return res.sendStatus(STATUS_CODE.NOT_FOUND);
        }
        return res.status(STATUS_CODE.OK).send(customersList.rows);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };
}

const newCustomer = async (req, res) => {
    const { name, phone, cpf, birthday } = req.body;

    try {
        let existCustomer = await connection.query('SELECT * FROM customers WHERE "cpf" = $1;', [cpf]);
        if (existCustomer.rows.length > 0) {
            return res.status(STATUS_CODE.CONFLICT).send('Usuário já existe');
        };

        await connection.query('INSERT INTO "customers" ("name", "phone", "cpf", "birthday") VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        return res.sendStatus(STATUS_CODE.CREATED);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };

};

export { getCustomers, newCustomer, getCustomersById };