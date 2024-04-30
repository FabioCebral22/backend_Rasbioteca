const sequelize = require('../database/database');
const Company = require('./company.model');
const Club = require('./club.model');
const Admin = require('./admin.model');
const Client = require('./client.model');

// Definir relaciones aquí
Club.belongsTo(Company, { 
    foreignKey: 'company_nif'
    
});
Company.hasMany(Club, { 
    foreignKey: 'company_nif' 
    
});

module.exports = {
  Company,
  Club,
  Admin,
  Client
};