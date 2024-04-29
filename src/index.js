const app = require("./app/app");
const sequelize = require("./database/database");
const { Event } = require('./model/loadModel');
const port = process.env.PORT || 3001;

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