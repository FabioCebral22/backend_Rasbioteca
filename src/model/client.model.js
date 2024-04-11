const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")

const sequelize = new Sequelize('abtnipbf', 'abtnipbf', '5pTKRnzXL7ebrRHvu2EqjYuZK0t8PT95', {
    host: 'manny.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432
});

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
    }
}, {
    sequelize, // Pasa la instancia de Sequelize aquí
    modelName: "Client"
});

module.exports = Client;

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();
