// Contient les fonctions qui s'appliquent aux différentes routes pour les utilisateurs

// On a besoin d'Express
const express = require('express');

// On crée un router avec la méthode mise à disposition par Express
const router = express.Router();
const userCtrl = require('../controllers/user');
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;

