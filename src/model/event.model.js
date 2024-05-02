const { tr } = require("@faker-js/faker");
const { Sequelize, Model, DataTypes, UUIDV4 } = require("sequelize")
const sequelize = require('../database/database');



class Event extends Model {}

Event.init({
    event_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique:true
    },
    event_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    event_description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    event_image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    event_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    client_state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: "Event"
});

module.exports = Event;





module.exports = Event;