const express = require( 'express' );
const mongoose = require( "mongoose" );

const qnController = require( "./db/question_controller" );
const configs = require( "./configs/configs" );

const app = express();
app.use( express.json() );
const port = 3000;

const setErrorMessage = ( errMessage, code ) => ( req, res ) => {
    res.statusCode = code;
    res.setHeader( 'content-type', 'application/json' );
    res.setHeader( 'Access-Control-Allow-Origin', '*' );
    res.json( { error_message: errMessage } );
}

app.route( "/api/questions/get_all_questions" )
    .get( qnController.getAllQuestions )
    .all( setErrorMessage( "Invalid HTTP Method!", 405 ) );

// for matching
app.route( "/api/questions/get_random_question" )
    .get( qnController.getRandomQuestion )
    .all( setErrorMessage( "Invalid HTTP Method!", 405 ) );

app.route( "/api/questions/create_question" )
    .post( qnController.createQuestion )
    .all( setErrorMessage( "Invalid HTTP Method!", 405 ) );

app.route( "/api/questions/update_question" )
    .put( qnController.updateQuestion )
    .all( setErrorMessage( "Invalid HTTP Method!", 405 ) );

app.route( "/api/questions/delete_question" )
    .delete( qnController.deleteQuestion )
    .all( setErrorMessage( "Invalid HTTP Method!", 405 ) );

const dbUri = configs[ process.env.NODE_ENV.trim() ][ "DB_URI" ];

if ( dbUri == null || dbUri === "" ) {
    console.error( "Error retrieving dbUri", dbUri );
    return;
}

app.listen( port, async () => {
    await mongoose.connect( dbUri );
    console.log( "connected to db" );

    console.log( `Questions microservice listening at http://localhost:${ port }` );
} );

module.exports = app;