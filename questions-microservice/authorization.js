const axios = require('axios');

const responseStatus = require( "./common/status" );
const clientErr = require( "./common/error_msgs/client_errors" );

exports.validate_admin = (req, res, next) => {
    const jwt = req.header("Authorization");

    if (jwt === undefined || jwt === null) {
        res
            .status(403)
            .json({
                status: responseStatus.FAILED,
                data: {
                    message: clientErr.AUTHORIZATION_FAILED
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
    axios.get(`https://peerprep.ml/api/user/validate_admin`, headers)
        .then(response => {
            next();
        })
        .catch(err => {
            console.log("err", err);
            res
                .status(403)
                .json({
                    status: responseStatus.FAILED,
                    data: {
                        message: clientErr.AUTHORIZATION_FAILED
                    }
                });
        });
}