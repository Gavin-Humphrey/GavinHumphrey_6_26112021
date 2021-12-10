const multer = require('multer');

const MIME_TYPES = {
//création d'une bibliothèque de type de fichier avec correspondance
'image/jpeg': 'jpeg',
'image/jpg': 'jpg',
'image/png': 'png',
};

const storage = multer.diskStorage({
//permet de definir l'emplacement destination du fichier
destination: (req, file, callback) => {
//section où on dit où mettre
callback(null, 'images'); //null dit pas d'erreur + nom du dossier destination
},
filename: (req, file, callback) => {
//section où on va donner un nom
/*On récup le nom du fichier utilisateur puis on supprime les espaces 
avec split qui va faire un tableau puis join va concatener le tout*/
const name = file.originalname.split(' ').join('_'); 
//recup de l'extension du fichier grace au mime_type
const extension = MIME_TYPES[file.mimetype]; 
//creation du nom avec date/heure pour le rendre unique
callback(null, name + Date.now() + '.' + extension); 
},
});
/*export du middleware avec recup de la constante + single pour dire 1 fichier 
en upload uniquement + "image" pour dire uniquement des images*/
module.exports = multer({ storage: storage }).single('image'); 
