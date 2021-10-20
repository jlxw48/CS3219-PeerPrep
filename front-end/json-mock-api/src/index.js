const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const port = 3002;
const SECRET_KEY = '123456789'
const expiresIn = '1h'
const fs = require('fs');
const path = require("path");
var cors = require('cors');

// Create a token from a payload 
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

// Verify the token 
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (decode !== undefined) {
            console.log(decode);
            return decode;
        }
        console.log(err);
        return err;
    })
}

// Check if the user exists in database
function isAuthenticated({ email, password }) {
    return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}


server.use(middlewares);
server.use(jsonServer.bodyParser)
server.use(cors({ origin: true, credentials: true }));

/*
 * User mocks
*/

const userdb = JSON.parse(fs.readFileSync(path.resolve(__dirname, './users.json'), 'UTF-8'))
const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, './db.json'), 'UTF-8'))

server.get('/ha', (req, res) => {
    res.status(200);
})

server.post('/users/register', (req, res) => {
    if (req.method === 'POST') {
        let userId = req.body['name'];
        let password = req.body['password'];
        let email = req.body['email'];

        res.status(200);
        res.json({
            "status": "success"
        })
    }
});

server.post('/users/login', (req, res) => {
    const { email, password } = req.body
    if (isAuthenticated({ email, password }) === false) {
        const status = 401
        const message = 'Incorrect email or password'
        res.status(status).json({ status, message })
        return
    }
    const access_token = createToken({ email, password })
    res.status(200).json({ access_token, status: "success", email })
})

server.get('/fetch_match_question', (req, res) => {
    res.status = 200
    res.json({ question: db['questions'][0] })
})

server.get('/match/start_find', (req, res) => {
    setTimeout(() => {
        res.status = 200
        res.json({
            status: "success",
            data: {
                partnerUsername: "Bobby",
                interviewId: "1234567890"
            }
        })
    }, 1000)
})

server.get('/chat/get_messages', (req, res) => {
    res.status = 200;
    res.json({
        status: "success",
        data: {
            history: db['chats']
        }
    })
})

server.use(/^(?!\/users).*$/, (req, res, next) => {
    console.log(req.headers);
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 401
        const message = 'Bad authorization header'
        res.status(status).json({ status, message })
        return
    }
    try {
        verifyToken(req.headers.authorization.split(' ')[1])
        next()
    } catch (err) {
        const status = 401
        const message = 'Error: access_token is not valid'
        res.status(status).json({ status, message })
    }
})

server.use(router);
server.listen(port);