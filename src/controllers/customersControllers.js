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

const getCustomerById = async (req, res) => {
    const id = req.params.id;
    try {
        let customer = await connection.query('SELECT * FROM "customers" WHERE "customers".id = $1;', [id]);
        if(customer.rows.length === 0) {
            return res.sendStatus(STATUS_CODE.NOT_FOUND);
        }
        return res.status(STATUS_CODE.OK).send(customer.rows);
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

const updateCustomer = async (req, res) => {
    const id = req.params.id;
    const { name, phone, cpf, birthday } = req.body;

    try {
        let isCustomerExist = await connection.query('SELECT * FROM "customers" WHERE "customers".id = $1;', [id]);
        if(isCustomerExist.rows.length === 0) {
            return res.sendStatus(STATUS_CODE.NOT_FOUND);
        }

        await connection.query('UPDATE "customers" set name= $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5', [name, phone, cpf, birthday, id]);
        return res.sendStatus(STATUS_CODE.CREATED);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };
}

export { getCustomers, newCustomer, getCustomerById, updateCustomer };