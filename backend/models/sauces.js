const mongoose = require('mongoose');

/* On crée un schema mangoose pour que les données qui sont dans la base MongoDB ne puissent pas différer de
celui précisé dans le schema Model des sauces. L'id est généré automatiquement par MongoDB */
const saucesSchema = mongoose.Schema({
// l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
  userId: { type: String, required: true },
// nom de la sauce
  name: { type: String, required: true },
// fabricant de la sauce
  manufacturer: { type: String, required: true },
// description de la sauce
  description: { type: String, required: true },
// le principal ingrédient épicé de la sauce
  mainPepper: {type: String, required: true},
// l'URL de l'image de la sauce téléchargée par l'utilisateur
  imageUrl: { type: String, required: true },
// nombre entre 1 et 10 décrivant la sauce
  heat: { type: Number, required: true },
// nombre d'utilisateurs qui aiment (= likent) la sauce
  likes: { type: Number, required: true },
// nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
  dislikes: { type: Number, required: true },
// tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce
  usersLiked: { type: Array, required: true },
// tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce
  usersDisliked: { type: Array, required: true }
});

module.exports = mongoose.model('sauces', saucesSchema);