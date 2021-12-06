
const mongoose = require('mongoose');
const express = require("express");
const helmet = require('helmet');
const session = require('express-session');
const cors = require("cors");
const path = require("path"); //import de path pour MAJ du chemin d'upload photo
require('dotenv').config();
const bodyParser = require('body-parser'); // Permet d'extraire l'objet JSON des requêtes POST
const nocache = require("nocache");

//import des fichiers JS du dossier ROUTES
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

//creation de la variable qui créée l'application EXPRESS & Helmet pour sécuriser les données
const app = express();
app.use(helmet());


mongoose.connect(process.env.SECRET_DB_USERS,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')
  );

   //ajout de cette application afin de dire à l'API qu'elle est public et les actions possible à faire par le front
app.use((req, res, next) => {
    res.setHeader('Access-control-Allow-Origin','*');//Just added for testing
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Définissez des options de cookie pour accroître la sécurité
const expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(session({
  name:  'session',
  secret: process.env.SESSION_SECRET,
  cookie: { secure: true,
            httpOnly: true,
            domain: 'http://localhost:3000',
            expires: expiryDate
          }
  })
);
  
//ajout du middleware qui donne le format de ce bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//Le dossier static qui permet de récupérer les images
app.use("/images", express.static(path.join(__dirname, "images")));

//Ce middleware Express définit des headers de réponse HTTP pour désactiver la mise en cache côté client. 
app.use(nocache());

app.use(cors());

// Middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(bodyParser.urlencoded({//Just added for testing
  extended: true
}));

//ajout du chemin de la route que les js devront prendre
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes)

module.exports = app;
