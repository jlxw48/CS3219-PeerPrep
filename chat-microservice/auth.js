const axios = require('axios');

const responseStatus = require( "./common/status/responseStatus" );
const clientErr = require( "./common/errors/clientErrors" );

exports.jwt_validate = (req, res, next) => {
    const jwt = req.header("Authorization");
    console.log("chat jwt", jwt);
    if (jwt === undefined || jwt === null) {
        res
            .status(401)
            .json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErr.JWT_AUTH_FAILED
                }
            });
        return;
    }

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
                        message: clientErr.JWT_AUTH_FAILED
                    }
                });
        });
}