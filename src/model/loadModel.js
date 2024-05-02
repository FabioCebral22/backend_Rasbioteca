const sequelize = require('../database/database');
const Company = require('./company.model');
const Club = require('./club.model');
const Event = require('./event.model');
const Ticket = require('./ticket.model')

Event.belongsTo(Club, {
  foreignKey: 'club_id'
} )
Club.hasMany(Event, {
  foreignKey: 'club_id'
})
Club.belongsTo(Company, {
  foreignKey: 'company_nif'
} )
Company.hasMany(Club, {
  foreignKey: 'company_nif'
})
const Admin = require('./admin.model');
const Client = require('./client.model');

// Definir relaciones aquí
Club.belongsTo(Company, { 
    foreignKey: 'company_nif'
    
});
Company.hasMany(Club, { 
    foreignKey: 'company_nif' 
    
});

Event.hasMany(Ticket, {
  foreignKey: 'event_id'
})
Ticket.belongsTo(Event, {
  foreignKey: 'event_id'
} )

module.exports = {
  Event,
  Company,
  Club,
  Admin,
  Client,
  Ticket
};