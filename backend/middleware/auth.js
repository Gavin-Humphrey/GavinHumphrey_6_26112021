//Nous importons le jwt pour vérifier le token
const jwt = require('jsonwebtoken');

/* Protéger les routes sélectionnées puis vérifier que l'utilisateur 
est authentifié avant d'autoriser l'envoi de ses requêtes */ 
module.exports = (req, res, next) => {
  try {
    /* On récupère le TOKEN dans le headers, autorization. Pour ce faire, 
    nous devons split autour de l'espace, puis récupérer uniquement le deuxième élément.*/
    const token = req.headers.authorization.split(' ')[1];
    /* On décode le TOKEN, vérifie que la clé SECRET-TOKEN que on a créée,
    pour la création de TOKEN, correspond à celle dans la fonction login  */
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); 
    /* On récupère le userId, on vérifie s'il y a un userId avec la requête et qu'il correspond à celui 
    du TOKEN. Et s'il y a un userId dans le corps de la requête et qu'il est différent, il renvoie une erreur */
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) { //
      throw 'Invalid user ID';
    } else {
      next();
    }
    //En cas d'erreur, nous envoyons une erreur 401 - erreur d'authentification
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};