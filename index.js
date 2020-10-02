// Para correr este archivo en la consola: node index.js
// console.log('Hola Mundo');

// User y password CLOUD MONGODB: lidiarq - z9Se2VTrbNfofQWt

// Importación de express
const express = require('express');
// Para leer las variables de entorno del fichero .env
require('dotenv').config();
// Importación de la base de datos de mongoose
const { dbConnection } = require('./database/config');
// Importación de cors
const cors = require('cors');

const path = require('path');



// Crear el servidor de express
const app = express();
// Configurar CORS
app.use(cors());
// Lectura y parseo del body
app.use(express.json());
// Base de datos
dbConnection();

// Directorio público
app.use(express.static('public'));

// console.log(process.env); PARA VER TODAS LAS VARIABLES DE ENTORNO

// RUTAS
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/hospitales', require('./routes/hospitales.routes'));
app.use('/api/medicos', require('./routes/medicos.routes'));
app.use('/api/todo', require('./routes/busquedas.routes'));
app.use('/api/upload', require('./routes/uploads.routes'));

// Lo último
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

/* // 1. Ruta get simple (para ver el resultado, abrir en Postman: http://localhost:3000/)
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola Mundo'
    });
});  */


// Para levantar el servidor, indicamos el puerto. Con: npm run start:dev, nos hace los cambios automáticamente
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});