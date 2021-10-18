const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        const token = jwt.sign(
            { 
                user: "test_user",
            },
            'CS3219_SECRET_KEY',
            {
              expiresIn: "1h",
            }
        );
        res
            .status(200)
            .cookie("cs3219_jwt", token, {
                httpOnly: true,
            })
            .json({
                status: "success",
                message: "successfully logged in user",
            });
    } catch (err) {
        next(err);
    }
}