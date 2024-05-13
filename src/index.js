const app = require("./app/app");
const sequelize = require("./database/database");
const { Event } = require('./model/loadModel');
const port = process.env.PORT || 3001;

//vaciar una tabla

// const { Sells } = require('./model/loadModel');

// async function recreateTicketTable() {
//   try {
//     await Sells.drop({ cascade: true });

//     await Sells.sync();

//     console.log('La tabla Ticket se ha recreado exitosamente.');
//   } catch (error) {
//     console.error('Error al recrear la tabla Ticket:', error);
//   } finally {
//     await sequelize.close();
//   }
// }

// recreateTicketTable();



sequelize.sync()
.then(() => {
    console.log("Database connected and models synchronized");
})
.catch(err => {
    console.error('Error al sincronizar las tablas:', err);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});