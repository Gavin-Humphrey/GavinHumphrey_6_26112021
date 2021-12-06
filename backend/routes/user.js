// Contient les fonctions qui s'appliquent aux différentes routes pour les utilisateurs

// On a besoin d'Express afin de créer un router
const express = require('express');

// On crée un router avec la méthode mise à disposition par Express
const router = express.Router();
//Nous avons créé le contrôleur pour associer les fonctions à différentes routes 
const userCtrl = require('../controllers/user');
//Ici, nous créons des routes POST où le front-end enverra l'adresse e-mail et le mot de passe 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//Ici, nous exportons notre routeur 
module.exports = router;

