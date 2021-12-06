const Sauce = require('../models/Sauces');
const fs = require('fs');//On emporte le file system (fs) pour la supression d'objet

// Afficher toutes les sauces 
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

// Afficher une seule sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Créer une sauce 
exports.createSauce = (req, res, next) => {
    //Les données de la requête envoyées par le front-end sous forme de form-data
    // sont stockées dans une variable qui est analysée en objet utilisable à l'aide de JSON.parse(). 
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    //Ici la sauce est sauvegardée dans la base de données
    sauce.save()
    //Ici une réponse est envoyée au front-end avec le statut 201 afin de ne pas laisser notre requête expirer 
        .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !'}))
        //Ici un code d'erreur est ajouté en cas d'erreur 
        .catch(error => {
            console.log(json({ error }));
            res.status(400).json({ error });
        });
};

// Modifier une sauce 
exports.modifySauce = (req, res, next) => {
    //on crée un objet sauceObject qui regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; 
    //s'il n'existe pas, on traite simplement l'objet entrant
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
      //On crée une instance Sauce à partir de sauceObject, 
      //puis on effectue la modification.
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };

// Supprimer une sauce 
exports.deleteSauce = (req, res, next) => {
    //Avant de supprimer un objet, nous devons le chercher et obtenir l'URL de l'image 
    //afin d'avoir accès au nom du fichier, pour pouvoir supprimer le fichier avec succès.
    /*Donc, ici, nous trouvons celui qui a le même id que celui dans le paramètre de la requête*/
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
          //Ici on récupère directement le nom du fichier 
        const filename = sauce.imageUrl.split('/images/')[1];
        //Et nous le supprimons avec l'aide de fs.unlink()
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      //On ajoute .catch, en cas d'erreur, c'est le code 500, il s'agit d'une erreur de serveur
      .catch(error => res.status(500).json({ error }));
  };

// Aimer ou ne pas aimer une sauce 
exports.likeOrDislike = (req, res, next) => {
    // Si il s'agit d'un like
    if(req.body.like === 1){
         // On push l'utilisateur et on incrémente le compteur de 1
        Sauce.updateOne({ _id: req.params.id },  {$inc: {likes: req.body.like++} ,$push: {usersLiked: req.body.userId}})
        .then ((sauce)=> res.status(200).json({ message: 'Like ajouté !'}))
        .catch(error => res.status(400).json({ error }));
        // S'il s'agit d'un dislike
    } else if (req.body.like === -1){
        // On push l'utilisateur et on incrémente le compteur de 1
        Sauce.updateOne({ _id: req.params.id },  {$inc: {dislikes: (req.body.like++)*-1} ,$push: {usersDisliked: req.body.userId}})
        .then ((Sauce)=> res.status(200).json({ message: 'Dislike ajouté !'}))
        .catch(error => res.status(400).json({ error }));
    } else{
        
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                // Si il s'agit d'annuler un like
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id}, {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}})
                    .then((sauce) => {res.status(200).json({ message: 'Like en moins !'})}) 
                    .catch(error => res.status(400).json({ error }))
                    // Si il s'agit d'annuler un dislike
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id}, {$pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}})
                    .then((sauce) => {res.status(200).json({ message: 'Dislike en moins !'})}) 
                    .catch(error => res.status(400).json({ error }))  
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
};