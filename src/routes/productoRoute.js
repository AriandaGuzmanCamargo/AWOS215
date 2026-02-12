const express = require('express');
const { poblarProductos, buscarProducto, buscarCategoria } = require('../controllers/externalController');
const router = express.Router();

router.post('/poblar', poblarProductos);
router.get('/buscar/:termino', buscarProducto);
router.get('/categoria/buscar/:termino', buscarCategoria);

module.exports = router;