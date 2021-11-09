const jsonServer = require('json-server')
const server = jsonServer.create()

server.get('/jwt_validate', (req, res) => {
    res.jsonp({})
});
server.get('/validate_admin', (req, res) => {
    res.jsonp({})
});
server.listen(3001, () => {
  console.log('JSON Server is running');
});
process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    // some other closing procedures go here
    process.exit(0);
});