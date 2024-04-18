const { tr } = require("@faker-js/faker");
const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")

const sequelize = new Sequelize('abtnipbf', 'abtnipbf', '5pTKRnzXL7ebrRHvu2EqjYuZK0t8PT95', {
    host: 'manny.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432
});

class EventStatus extends Model {}

EventStatus.init({
    activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    aprovedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: "EventStatus"
});

module.exports = EventStatus;

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully (EventStatus).');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = EventStatus;