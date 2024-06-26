const { Sequelize } = require("sequelize");
const sequelize = require('../database/database');
const Company = require('./company.model');
const Club = require('./club.model');
const Event = require('./event.model');
const Ticket = require('./ticket.model');
const Admin = require('./admin.model');
const Client = require('./client.model');
const Sells = require('./sells.model');
const Reviews = require('./reviews.model')

Event.belongsTo(Club, {
    foreignKey: 'club_id'
});
Club.hasMany(Event, {
    foreignKey: 'club_id'
});
Club.belongsTo(Company, {
    foreignKey: 'company_nif'
});
Company.hasMany(Club, {
    foreignKey: 'company_nif'
});

Club.belongsTo(Company, {
    foreignKey: 'company_nif'
});
Company.hasMany(Club, {
    foreignKey: 'company_nif'
});

Event.hasMany(Ticket, {
    foreignKey: 'event_id'
});
Ticket.belongsTo(Event, {
    foreignKey: 'event_id'
});

Sells.belongsTo(Client, {
    foreignKey: 'client_id'
});
Client.hasMany(Sells, {
    foreignKey: 'client_id'
});

Sells.belongsTo(Ticket, {
    foreignKey: 'ticket_id'
});
Ticket.hasMany(Sells, {
    foreignKey: 'ticket_id'
});
Reviews.belongsTo(Client, {
    foreignKey: 'client_id'
});
Client.hasMany(Reviews, {
    foreignKey: 'client_id'
});

Reviews.belongsTo(Club, {
    foreignKey: 'club_id'
});
Club.hasMany(Reviews, {
    foreignKey: 'club_id'
});

module.exports = {
    Event,
    Company,
    Club,
    Admin,
    Client,
    Ticket,
    Sells,
    Reviews
};
