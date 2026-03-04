const express = require('express');
const { poblarProductos, buscarProducto, buscarCategoria, obtenerProductos, buscarProductos } = require('../controllers/externalController');
const router = express.Router();

router.get('/', obtenerProductos);
router.post('/poblar', poblarProductos);
router.get('/buscar', buscarProductos);
router.get('/buscar/:termino', buscarProducto);
router.get('/categoria/buscar/:termino', buscarCategoria);

module.exports = router;