
// On utilise la fonctionne require pour importer des requets http
const http = require('http');
// importer l'appli express que nous avons exporter dans app.js
const app = require('./app');
// Comme un validateur qui vérifie le port si c'est en numérique ou texte
const normalizePort = val => { 
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// pour verifie si la 3000 exists sinon qu'il prend nimporte quelle port
const port = normalizePort(process.env.PORT || '3000');
// indiquer quelle port express doit utiliser
app.set('port', port);
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// Sert a recuperer automatiquement les commands d'app.js
const server = http.createServer(app);
// pour ecouter l'adresse de port s'il y a une erreur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
