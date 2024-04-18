const { tr } = require("@faker-js/faker");
const {Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")
const sequelize = require("../database/database")
const Club = require("../model/club.model")

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
    sequelize,
    modelName: "Company"
});

module.exports = Company;