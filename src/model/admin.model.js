const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize  = require("../database/database");

class Admin extends Model {}

Admin.init({
    admin_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    admin_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admin_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    admin_password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: "Admin"
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully (Admin).');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = Admin;
