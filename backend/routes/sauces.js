// Création du router qui contient les fonctions qui s'appliquent aux différentes routes pour les sauces
// Dans le routeur on ne veut QUE la logique de routing, ainsi la logique métier sera enregistrée dans le controller sauce.js

// Ajout de plugin externe nécessaire pour utiliser le router d'Express
const express = require('express');
// Appel du routeur avec la méthode mise à disposition par Express
const router = express.Router();

// Ajout des middleweares
// On importe le middleware auth pour sécuriser les routes
const auth = require('../middleware/auth'); // Récupère la configuration d'authentification JsonWebToken
//On importe le middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');

// On associe les fonctions aux différentes routes, on importe le controller
const saucesCtrl = require('../controllers/sauces');

/* En exportant dans le controller la logique métier, les fonctions, on voit plus clairement quelles sont les routes dont on dispose
 et on utilisera une sémantique très claire pour comprendre ce qu'elles permettent.
 On a quelque chose de plus modulaire plus facile à comprendre et plus facile à maintenir*/
//On utilise l'auth que on a créée dans le middleware pour protéger toutes nos routes. 
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeOrDislike);

module.exports = router;