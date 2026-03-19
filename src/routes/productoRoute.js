const express = require('express');// Importa el módulo express para crear un router que manejará las rutas relacionadas con los productos, como obtener la lista de productos, buscar productos por término o categoría, poblar la base de datos con productos de ejemplo y crear nuevos productos. Este router se encargará de definir las rutas específicas para cada una de estas acciones y delegar la lógica correspondiente a los controladores.
const { poblarProductos, buscarProducto, buscarCategoria, obtenerProductos, buscarProductos, crearProductos } = require('../controllers/externalController');
const authMidelware = require('../midelwares/authMidelware');// Importa el middleware de autenticación desde el archivo authMidelware.js, que se utilizará para proteger la ruta de creación de productos. Este middleware verificará que el usuario esté autenticado antes de permitirle acceder a la ruta de creación de productos, lo que garantiza que solo los usuarios autorizados puedan agregar nuevos productos a la base de datos.
const router = express.Router();// Crea una nueva instancia de Router de Express, que se utilizará para definir las rutas relacionadas con los productos. Esto permite organizar las rutas relacionadas con los productos en un módulo separado, lo que mejora la modularidad y la mantenibilidad del código.
// Define las rutas para manejar las diferentes acciones relacionadas con los productos. Cada ruta está asociada a una función del controlador correspondiente que se encargará de procesar la solicitud y generar la respuesta adecuada para el cliente. Algunas rutas, como la de creación de productos, están protegidas por el middleware de autenticación para asegurar que solo los usuarios autorizados puedan acceder a ellas.
router.get('/', obtenerProductos);
router.post('/poblar', poblarProductos);
router.get('/buscar', buscarProductos);
router.get('/buscar/:termino', buscarProducto);
router.get('/categoria/buscar/:termino', buscarCategoria);
router.post('/crear', authMidelware,crearProductos);


module.exports = router;