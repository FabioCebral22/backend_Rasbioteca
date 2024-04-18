const { Sequelize } = require("sequelize");


const sequelize = new Sequelize('abtnipbf', 'abtnipbf', '5pTKRnzXL7ebrRHvu2EqjYuZK0t8PT95', {
    host: 'manny.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432
});

module.exports = sequelize;