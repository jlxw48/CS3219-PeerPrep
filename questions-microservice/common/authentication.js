const axios = require('axios');

const responseStatus = require( "./status" );
const clientErr = require( "./error_msgs/client_errors" );

const JWT_VALIDATE_URL = process.env.NODE_ENV !== "test" ? process.env.LIVE_JWT_VALIDATE : process.env.TEST_JWT_VALIDATE;
const JWT_STUB_HEADER = "stub_header";

exports.jwt_validate = (req, res, next) => {
    const jwt = req.header("Authorization") || JWT_STUB_HEADER;

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
    axios.get(JWT_VALIDATE_URL, headers)
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