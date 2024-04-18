const { tr } = require("@faker-js/faker");
const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")

const sequelize = new Sequelize('abtnipbf', 'abtnipbf', '5pTKRnzXL7ebrRHvu2EqjYuZK0t8PT95', {
    host: 'manny.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432
});

class Club extends Model { }

Club.init({
    club_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    club_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    club_rules: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    club_description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    club_schedule: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize, // Pasa la instancia de Sequelize aquí
    modelName: "Club"
});

module.exports = Club;

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully (Club).');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = Club;