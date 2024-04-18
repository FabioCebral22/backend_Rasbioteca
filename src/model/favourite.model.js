const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")

const sequelize = new Sequelize('abtnipbf', 'abtnipbf', '5pTKRnzXL7ebrRHvu2EqjYuZK0t8PT95', {
    host: 'manny.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432
});

class Favourite extends Model {}

Favourite.init({
    client_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    company_NIF: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    }
}, {
    sequelize,
    modelName: "Favourite"
});

module.exports = Favourite;

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully (Favourite).');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();