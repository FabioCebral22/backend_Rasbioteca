const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")

const sequelize  = require("../database/database");

class Reviews extends Model {}

Reviews.init({
    review_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    review_data: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    review_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    review_value: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
    }
    }
    , {
    sequelize,
    modelName: "Reviews"
});

module.exports = Reviews;


