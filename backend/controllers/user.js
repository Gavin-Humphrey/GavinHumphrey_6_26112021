const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()
const pwdFormat = require('password-validator');//added now
var pwdSchema = new pwdFormat();//added now

pwdSchema
.is().min(8)                                    // Minimun lenght: 8
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have at least a digit
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Values blacklisted


const User = require('../models/User');

// Inscription 
exports.signup = (req, res, next) => {

  if(!pwdSchema.validate(req.body.password)){//just added
    return res.status(400).json({message: "low security of password! " + pwdSchema.validate(req.body.password, {list:true})})//just added
  }
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: (req.body.email),
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// Connexion par mot de passe 
exports.login = (req, res, next) => {
    User.findOne({ email: (req.body.email) })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
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

 