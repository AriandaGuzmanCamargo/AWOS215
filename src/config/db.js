const { Pool } = require('pg'); // Importa el Pool de pg para manejar conexiones a PostgreSQL
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env para configurar la conexión a la base de datos

const pool = new Pool({ // Crea una nueva instancia de Pool con la configuración de la base de datos
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST
});

pool.on('connect', () => console.log('Conexion exitosa'));// Escucha el evento 'connect' para confirmar que la conexión a la base de datos se ha establecido correctamente

module.exports = pool; // Exporta el pool para que pueda ser utilizado en otras partes de la aplicación, como en los controladores para ejecutar consultas a la base de datos