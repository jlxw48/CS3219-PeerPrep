const axios = require('axios');

const responseStatus = require( "./common/responseStatus" );
const { JWT_AUTH_FAILED } = require( './common/clientErrors' );
const TEST_JWT_VALIDATE='http://localhost:3006/jwt_validate'
const LIVE_JWT_VALIDATE='https://peerprep.ml/api/user/jwt_validate'
const JWT_VALIDATE_URL = process.env.NODE_ENV !== "test" ? LIVE_JWT_VALIDATE : TEST_JWT_VALIDATE

const JWT_STUB_HEADER = "stub_header";

exports.jwt_validate = (req, res, next) => {
    const jwt = req.header("Authorization") || JWT_STUB_HEADER;

    if (jwt === undefined || jwt === null) {
        res
            .status(401)
            .json({
                status: responseStatus.FAILED,
                data: {
                    message: JWT_AUTH_FAILED
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
                        message: JWT_AUTH_FAILED
                    }
                });
        });
}