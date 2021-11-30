const mongoose = require('mongoose');
const express = require("express");
const helmet = require('helmet');
const cors = require("cors");
const path = require("path"); //import de path pour MAJ du chemin d'upload photo
require('dotenv').config();

//import des fichiers JS du dossier ROUTES
const usersRoutes = require("./routes/users");
const saucesRoutes = require("./routes/sauces");

//creation de la variable qui créée l'application EXPRESS & Helmet pour sécuriser les données
const app = express();
app.use(helmet());

mongoose.connect(process.env.SECRET_DB_USERS,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')
  );

   //ajout de cette application afin de dire à l'API qu'elle est public et les actions possible à faire par le front
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  
  //ajout du middleware qui donne le format de ce bodyParser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true}));

  //permet de récupérer les images
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cors());

//ajout du chemin de la route que les js devront prendre
//app.use("/api/auth", usersRoutes);
//app.use("/api/sauces", saucesRoutes)

module.exports = app;