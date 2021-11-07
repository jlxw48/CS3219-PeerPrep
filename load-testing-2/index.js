const express = require( 'express' );

const app = express();
app.use( express.json() );
const port = process.env.PORT || 3000;

app.route( "/load-2/" )
    .get( ( req, res ) => {
        for ( var i = 0; i < 1000000; i++ ) {
            Math.sqrt( i );
        }
        res.json( "finished looping 2" );
    } );

app.listen( port, async () => {
    console.log( `load-2 listening at http://localhost:${ port }` );
} );