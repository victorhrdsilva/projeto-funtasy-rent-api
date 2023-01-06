import connection from '../db/db.js';

const getBoardGames = async (req, res) => {
    const query = req.query.name;
    
    try {
        const categoriesList = await connection.query('SELECT * FROM "boardGames";');
        res.send(categoriesList.rows);
    } catch (error) {
        res.status(500).send(error.message);
    };
};

const newBoardGame = async (req, res) => {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

    try {
        let existCategorie = await connection.query('SELECT * FROM categories WHERE "id" = $1;', [categoryId]);
        if (existCategorie.rows.length === 0) {
            return res.status(400).send('Categoria informada não existe');
        };

        let existBoardGame = await connection.query('SELECT * FROM "boardGames" WHERE "name" = $1;', [name]);
        if (existBoardGame.rows.length > 0) {
            return res.status(409).send('Jogo informado já existe');
        };

        await connection.query('INSERT INTO "boardGames" ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay]);
        return res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    };

};

export { getBoardGames, newBoardGame };