import connection from '../db/db.js';
import { STATUS_CODE } from '../enums/statusCode.js';
import dayjs from 'dayjs';


const getRentals = async (req, res) => {
    const queryCustomerId = req.query.customerId;
    const queryBoardGameId = req.query.boardGameId;
    try {
        let rentalsList
        if (queryCustomerId !== undefined) {
            rentalsList = await connection.query(`
                SELECT 
                    rentals.*,
                    to_json("customers") as custumer,
                    to_json("boardGames") as "boardGame" 
                FROM 
                    rentals 
                LEFT JOIN customers ON 
                    rentals."customerId" = customers.id 
                LEFT JOIN "boardGames" ON 
                    rentals."gameId" = "boardGames".id 
                LEFT JOIN categories ON 
                    "boardGames"."categoryId" = categories.id
                WHERE rentals."customerId" = $1;
            `,
                [queryCustomerId]);
        } else if (queryBoardGameId !== undefined) {
            rentalsList = await connection.query(`
                SELECT 
                    rentals.*,
                    to_json("customers") as custumer,
                    to_json("boardGames") as "boardGame" 
                FROM 
                    rentals 
                LEFT JOIN customers ON 
                    rentals."customerId" = customers.id 
                LEFT JOIN "boardGames" ON 
                    rentals."gameId" = "boardGames".id 
                LEFT JOIN categories ON 
                    "boardGames"."categoryId" = categories.id
                WHERE rentals."boardGameId" = $1;
            `,
                [queryBoardGameId]);
        } else {
            rentalsList = await connection.query(`
                SELECT 
                    rentals.*,
                    to_json("customers") as custumer,
                    to_json("boardGames") as "boardGame" 
                FROM 
                    rentals 
                LEFT JOIN customers ON 
                    rentals."customerId" = customers.id 
                LEFT JOIN "boardGames" ON 
                    rentals."gameId" = "boardGames".id 
                LEFT JOIN categories ON 
                    "boardGames"."categoryId" = categories.id;
            `);
        }

        res.status(STATUS_CODE.OK).send(rentalsList.rows);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };
};

const newRental = async (req, res) => {
    const { customerId, boardGameId, daysRented } = req.body;

    try {
        let existCustomer = await connection.query('SELECT * FROM customers WHERE "id" = $1;', [customerId]);
        if (existCustomer.rows.length == 0) {
            return res.status(STATUS_CODE.BAD_REQUEST).send('Usuário informado não existe');
        };
        let existBoardGame = await connection.query('SELECT * FROM "boardGames" WHERE "id" = $1;', [boardGameId]);
        if (existBoardGame.rows.length == 0) {
            return res.status(STATUS_CODE.BAD_REQUEST).send('Jogo informado não existe');
        };
        let gamesAvailable = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;', [boardGameId])
        if (gamesAvailable.rows.length >= existBoardGame.rows[0].stockTotal) {
            return res.status(STATUS_CODE.BAD_REQUEST).send('Jogo indisponível');
        };

        const day = dayjs();
        await connection.query(`
        INSERT INTO "rentals" 
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, boardGameId, day, daysRented, null, existBoardGame.rows[0].pricePerDay * daysRented, null]);
        return res.sendStatus(STATUS_CODE.CREATED);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };

};

const returnRental = async (req, res) => {
    const id = req.params.id;
    try {
        let existRental = await connection.query(`
        SELECT 
        rentals.*,
        "boardGames"."pricePerDay"
        FROM 
        rentals
        JOIN
        "boardGames"
        ON 
        rentals."gameId" = "boardGames".id
        WHERE rentals.id = $1;
        `, [id]);
        
        if (existRental.rows.length == 0) {
            return res.status(STATUS_CODE.NOT_FOUND).send('Aluguel não existe');
        };
        if (existRental.rows[0].returnDate) {
            return res.status(STATUS_CODE.BAD_REQUEST).send('Jogo já devolvido');
        };
        const today = dayjs();
        const difference = today.diff(existRental.rows[0].rentDate, 'day') * -1;
        const delayFee = (difference - existRental.rows[0].daysRented) * existRental.rows[0].pricePerDay;
        console.log(today, delayFee)
        await connection.query(`UPDATE "rentals" SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`, [today, delayFee, id]);

        return res.sendStatus(STATUS_CODE.OK);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };
}

const deleteRental = async (req, res) => {
    const id = req.params.id;
    try {
        let existRental = await connection.query(`
        SELECT 
            *
        FROM 
            rentals
        WHERE 
            id = $1;
        `, [id]);
        if (existRental.rows.length == 0) {
            return res.status(STATUS_CODE.NOT_FOUND).send('Aluguel não existe');
        };
        if (!existRental.rows[0].returnDate) {
            return res.status(STATUS_CODE.BAD_REQUEST).send('Jogo ainda não devolvido');
        };
        await connection.query(`DELETE FROM "rentals" WHERE id = $1`, [id]);

        return res.sendStatus(STATUS_CODE.OK);
    } catch (error) {
        res.status(STATUS_CODE.SERVER_ERROR).send(error.message);
    };
}

export { getRentals, newRental, returnRental, deleteRental };