const express = require("express");

const authentication = require("./authentication");
const login = require("./login");

const app = express();
app.use( express.json() );
const PORT = 3000;

app.route("/jwt")
    .all((req, res) => {
        res.json({ok: true, message: "basic!"});
    });

app.route("/jwt/some_page")
    .all(authentication.authenticateToken)
    .all((req, res) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ok: true, message: "API is working! You are awesome!"});
    });

app.route("/jwt/login")
    .get(login.loginUser);

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});