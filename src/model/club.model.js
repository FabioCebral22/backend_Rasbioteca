const { tr } = require("@faker-js/faker");
const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")
const sequelize  = require("../database/database")
const Company = require("../model/company.model")

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
    sequelize,
    modelName: "Club"
});

module.exports = Club;