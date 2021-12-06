//Nous apportons notre package de cryptage de mot de passe, bcrypt
const bcrypt = require('bcrypt');
// On utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()
const pwdFormat = require('password-validator');
var pwdSchema = new pwdFormat();

pwdSchema
.is().min(8)                                    // Minimun lenght: 8
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have at least a digit
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Values blacklisted

// On récupère notre model User ,créer avec le schéma mongoose
const User = require('../models/User');

// La fonction signup, pour enregistrer de nouveaux utilisateurs. 
exports.signup = (req, res, next) => {

  if(!pwdSchema.validate(req.body.password)){
    return res.status(400).json({message: "low security of password! " + pwdSchema.validate(req.body.password, {list:true})})//just added
  }
  //Pour sécuriser notre mot de passe, nous appelons la fonction de hachage de bcrypt 
  //dans notre mot de passe et lui demandons de hacher et SALT « saler » le mot de passe 10 fois.
    bcrypt.hash(req.body.password, 10)
    //Ici, nous récupérons le hash du mot de passe 
    //et l'enregistrons dans new user qui sera enregistré dans la base de données
      .then(hash => {
        const user = new User({
          email: (req.body.email),
          password: hash   //Ici, nous enregistrons le mot de passe crypté/haché
        });
        //Nous utilisons la méthode save pour le sauvegarder dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// La fonction login, pour permettre aux utilisateurs existents de se connecter avec leurs mots de passe. 
/*On commence par trouver un utilisateur dans la base de données dont l'adresse email 
correspond à celle renseignée dans l'application par l'utilisateur. 
Si l'utilisateur n'existe pas, un message d'erreur sera renvoyé*/
exports.login = (req, res, next) => {
  //Ici, nous utilisons un object filter pour comparer l'adresse e-mail
    User.findOne({ email: (req.body.email) })
      .then(user => {
        //Si un utilisateur n'est pas trouvé, il renvoie un code 401 pour utilisateur non autorisé
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        //Ici, nous utilisons bcrypt avec la fonction "compare" pour comparer le mot de passe avec l'utilisateur trouvé 
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            /*S'il est valide, un Id ainsi qu'un SECRET TOKEN, d'authentification,
            générés par jwt, sont envoyés et la connexion est validée*/  
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.SECRET_TOKEN,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

 