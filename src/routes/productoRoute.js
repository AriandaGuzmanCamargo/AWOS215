const express = require('express');
const { poblarProductos, buscarProducto, buscarCategoria, obtenerProductos, buscarProductos, crearProductos } = require('../controllers/externalController');
const authMidelware = require('../midelwares/authMidelware');
const router = express.Router();

router.get('/', obtenerProductos);
router.post('/poblar', poblarProductos);
router.get('/buscar', buscarProductos);
router.get('/buscar/:termino', buscarProducto);
router.get('/categoria/buscar/:termino', buscarCategoria);
router.post('/crear', authMidelware,crearProductos);


module.exports = router;