const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")

const sequelize = new Sequelize('abtnipbf', 'abtnipbf', '5pTKRnzXL7ebrRHvu2EqjYuZK0t8PT95', {
    host: 'manny.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432
});

class Reviews extends Model {}

Reviews.init({
    review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    review: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    review_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: "Reviews"
});

module.exports = Reviews;

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully (Reviews).');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();
