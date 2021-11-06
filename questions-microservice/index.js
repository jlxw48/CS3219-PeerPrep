const express = require( 'express' );
const mongoose = require( "mongoose" );
const cors = require( 'cors' );

const qnController = require( "./db/question_controller" );
const configs = require( "./configs/configs" );
const clientErr = require( "./common/error_msgs/client_errors" );
const dbErr = require( "./common/error_msgs/db_errors" );
const msg = require( "./common/msgs" );
const responseStatus = require( "./common/status" );
const authentication = require( "./authentication" );
const authorization = require( "./authorization" );

const app = express();
app.use( express.json() );
var corsOptions = {
    origin: ['https://peerprep.ml', 'https://peerprep-g5.tk', 'http://localhost:3000'],
    credentials: true
};
app.use( cors( corsOptions ) );
const port = 3000;

const setErrorMessage = ( errMessage, code ) => ( req, res ) => {
    res.statusCode = code;
    res.setHeader( 'content-type', 'application/json' );
    res.setHeader( 'Access-Control-Allow-Origin', 'https://peerprep.ml/' );
    res.json( {
        status: responseStatus.FAILED,
        data: {
            message: errMessage
        }
    } );
}

const statusCheck = ( req, res ) => {
    res.json( {
        status: responseStatus.SUCCESS,
        data: {
            message: msg.STATUS_HEALTHY
        }
    } );
};

<<<<<<< HEAD
=======
// for matching
>>>>>>> 60efee7a4573a04a3959dc845ff13878fe3e2a75
app.route( "/api/questions/get_random_question" )
    .get( qnController.getRandomQuestion )
    .all( setErrorMessage( clientErr.INVALID_HTTP_METHOD, 405 ) );

app.route( "/api/questions/status" )
    .get( statusCheck )
    .all( setErrorMessage( clientErr.INVALID_API_ENDPOINT, 404 ) );

app.route( "/api/questions/:id" )
<<<<<<< HEAD
    // .all( authentication.jwt_validate )
    // .all( authorization.validate_admin )
=======
    .all( auth.jwt_validate )
>>>>>>> 60efee7a4573a04a3959dc845ff13878fe3e2a75
    .put( qnController.updateQuestion )
    .delete( qnController.deleteQuestion )
    .all( setErrorMessage( clientErr.INVALID_HTTP_METHOD, 405 ) );

<<<<<<< HEAD
app.route( "/api/questions/" ) 
    .get( qnController.getAllQuestions )
    // .post( authentication.jwt_validate )
    // .post( authorization.validate_admin )
=======
app.route( "/api/questions/" ) // TODO fix routing prefix issue 
    .get( qnController.getAllQuestions )
    .post( auth.jwt_validate )
>>>>>>> 60efee7a4573a04a3959dc845ff13878fe3e2a75
    .post( qnController.createQuestion )
    .all( setErrorMessage( clientErr.INVALID_HTTP_METHOD, 405 ) );

app.route( "/*" )
    .all( setErrorMessage( clientErr.INVALID_API_ENDPOINT, 404 ) );

const dbUri = configs[ process.env.NODE_ENV.trim() ][ "DB_URI" ];

if ( dbUri == null || dbUri === "" ) {
    console.error( dbErr.CANNOT_RETRIEVE_DB_URI, dbUri );
    return;
}

app.listen( port, async () => {
    await mongoose.connect( dbUri );
    console.log( dbErr.CONNECTED );

    console.log( `Questions microservice listening at http://localhost:${ port }` );
} );

module.exports = app;
