const jsonServer = require('json-server')
const server = jsonServer.create()

server.get('/jwt_validate', (req, res) => {
    res.jsonp({})
});

server.get('/validate_admin', (req, res) => {
    res.jsonp({})
});

server.listen(8002, () => {
  console.log('JSON Server is running');
});
