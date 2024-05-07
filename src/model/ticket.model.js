const { tr } = require("@faker-js/faker");
const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")

const sequelize = require("../database/database")

class Ticket extends Model {}

Ticket.init({
    ticket_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    ticket_name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    ticket_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    ticket_quantity: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    ticket_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    sequelize,
    modelName: "Ticket"
});

module.exports = Ticket;