const { tr } = require("@faker-js/faker");
const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")

const sequelize = new Sequelize('abtnipbf', 'abtnipbf', '5pTKRnzXL7ebrRHvu2EqjYuZK0t8PT95', {
    host: 'manny.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432
});

class Ticket extends Model {}

Ticket.init({
    ticket_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ticket_price: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    ticket_qr_code: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    ticket_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: "Ticket"
});

module.exports = Ticket;

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully (Ticket).');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = Ticket;