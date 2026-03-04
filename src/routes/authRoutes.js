const express = require('express');
const router = express.Router();
const authController = require ('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login); // Agrega esta línea para la ruta de login

module.exports = router;