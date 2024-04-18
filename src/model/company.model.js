const { tr } = require("@faker-js/faker");
const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")

const sequelize = new Sequelize('abtnipbf', 'abtnipbf', '5pTKRnzXL7ebrRHvu2EqjYuZK0t8PT95', {
    host: 'manny.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432
});

class Company extends Model { }

Company.init({
    company_nif: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique:true
    },

    company_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    company_info: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company_status: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: true,
    }
}, {
    sequelize, // Pasa la instancia de Sequelize aquí
    modelName: "Company"
});

module.exports = Company;

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully (Company).');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

module.exports = Company;