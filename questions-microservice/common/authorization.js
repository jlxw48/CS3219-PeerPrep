const axios = require('axios');

const responseStatus = require( "./status" );
const clientErr = require( "./error_msgs/client_errors" );

const VALIDATE_ADMIN_URL = process.env.NODE_ENV !== "test" ? process.env.LIVE_VALIDATE_ADMIN : process.env.TEST_VALIDATE_ADMIN;
const JWT_STUB_HEADER = "stub_header";

exports.validate_admin = (req, res, next) => {
    const jwt = req.header("Authorization") || JWT_STUB_HEADER;

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
    console.log(VALIDATE_ADMIN_URL);
    axios.get(VALIDATE_ADMIN_URL, headers)
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