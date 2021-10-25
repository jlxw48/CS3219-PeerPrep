const express = require( 'express' );
const axios = require("axios").default;

const app = express();
app.use( express.json() );
const port = process.env.PORT || 3000;

app.route( "/load-1/questions" )
    .get( ( req, res ) => {
        axios.get( 'http://questions:3000/api/questions' ) // this is not routing to port 3000
            .then( ( response ) => {
                // console.log(response.data);
                res.json( response.data );
            } )
            .catch( ( error ) => {
                console.log( error );
                res.json( { err_msg: "error fetching all photos" } );
            } );
    } );

app.route( "/load-1/load-2" )
    .get( ( req, res ) => {
        fetch("http://load-2:3000")
            .then((response) => {
                res.json("reached load 2");
            })
            .catch((err) => {
                res.json("failed to reach load 2");
            }

            )
    } );

app.route( "/load-1/" )
    .get( ( req, res ) => {
        for ( var i = 0; i < 1000000; i++ ) {
            Math.sqrt( i );
        }
        res.json( "finished looping 1" );
    } );

app.listen( port, async () => {
    console.log( `load-1 listening at http://localhost:${ port }` );
} );