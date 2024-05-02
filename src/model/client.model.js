const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")

const sequelize = require("../database/database")

class Client extends Model { }

Client.init({
    client_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },

    client_nickname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    client_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    client_password: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    client_name: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    client_img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    client_state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
}, {
    sequelize, 
    modelName: "Client"
});

module.exports = Client;
