const axios = require('axios');

const responseStatus = require( "./common/responseStatus" );
const { JWT_AUTH_FAILED } = require( './common/clientErrors' );

exports.jwt_validate = (req, res, next) => {
    const jwt = req.header("Authorization");
    console.log("text jwt", jwt);
    const headers = {
        headers: {
            Authorization: jwt,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };
    axios.get(`https://peerprep.ml/api/user/jwt_validate`, headers)
        .then(response => {
            next();
        })
        .catch(err => {
            console.log("err", err);
            res
                .status(401)
                .json({
                    status: responseStatus.FAILED,
                    data: {
                        message: JWT_AUTH_FAILED
                    }
                });
        });
}