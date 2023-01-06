import connection from '../db/db.js';
import { STATUS_CODE } from '../enums/statusCode.js';

const getBoardGames = async (req, res) => {
    const query = req.query.name;

    try {
        let boardGameList
        if(query !== undefined) {
            boardGameList = await connection.query('SELECT "boardGames".*, categories.name AS "categoryName" FROM "boardGames" JOIN categories ON "boardGames"."categoryId" = categories.id WHERE "boardGames".name ILIKE $1;', [`${query}%`]);
        } else {
            boardGameList = await connection.query('SELECT "boardGames".*, categories.name AS "categoryName" FROM "boardGames" JOIN categories ON "boardGames"."categoryId" = categories.id;');
        }

        res.status(STATUS_CODE.OK).send(boardGameList.rows);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };
};

const newBoardGame = async (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        let existCategorie = await connection.query('SELECT * FROM categories WHERE "id" = $1;', [categoryId]);
        if (existCategorie.rows.length === 0) {
            return res.status(STATUS_CODE.BAD_REQUEST).send('Categoria informada não existe');
        };

        let existBoardGame = await connection.query('SELECT * FROM "boardGames" WHERE "name" = $1;', [name]);
        if (existBoardGame.rows.length > 0) {
            return res.status(STATUS_CODE.CONFLICT).send('Jogo informado já existe');
        };

        await connection.query('INSERT INTO "boardGames" ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay]);
        return res.sendStatus(STATUS_CODE.CREATED);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };

};

export { getBoardGames, newBoardGame };