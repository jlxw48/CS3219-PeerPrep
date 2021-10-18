const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try {
        if (token == null) {
            return res
                .status(401)
                .json({
                    status: "failure",
                    message: "you are not authenticated to view this page! please log in!"
                });
        }
    
        jwt.verify(token, 'CS3219_SECRET_KEY', (err, user) => {
            if (err) {
                console.log(err);
                return res
                .status(401)
                .json({
                    status: "failure",
                    message: "you are not authenticated to view this page! please log in!"
                });
            }
    
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}