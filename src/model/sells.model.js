const { tr } = require("@faker-js/faker");
const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize");

const sequelize  = require("../database/database");

class Sells extends Model {}

Sells.init({
    sell_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sell_total_price: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    sell_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    sell_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    qr_code:{
        type: DataTypes.STRING, // Cambiado a STRING para almacenar el código QR como una cadena
        allowNull: false,
    },
    qr_guests:{
        type: DataTypes.INTEGER, // Suponiendo que qr_guests es un número entero
        allowNull: false,
        defaultValue: 1, // Valor predeterminado para qr_guests, puedes cambiarlo según tus necesidades
    }
}, {
    sequelize,
    modelName: "Sells"
});

module.exports = Sells;




