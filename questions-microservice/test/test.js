process.env.NODE_ENV = "test";

const chai = require( "chai" );
const chaiHttp = require( "chai-http" );

const app = require( "../index" );
const Question = require( "../db/question_model" );
const testData = require( "./test_data" );

const expect = chai.expect;
const should = chai.should();
chai.use( chaiHttp );

describe( "add 2 questions", () => {
    before( ( done ) => {
        Question.deleteMany( {}, ( err ) => {
            done();
        } );
    } );

    describe( "POST /api/questions/", () => {
        it( "should post 1 question", ( done ) => {
            chai.request( app )
                .post( "/api/questions/" )
                .send( testData[ "post" ][ "validQuestion1" ] )
                .end( ( err, res ) => {
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    done();
                } );
        } );

        it( "should post another question", ( done ) => {
            chai.request( app )
                .post( "/api/questions/" )
                .send( testData[ "post" ][ "validQuestion2" ] )
                .end( ( err, res ) => {
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    done();
                } );
        } );
    } );
} );

describe( "get all questions", () => {
    describe( "GET /api/questions/", () => {
        it( "should get all questions", ( done ) => {
            chai.request( app )
                .get( "/api/questions/" )
                .end( ( err, res ) => {
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    res.body.data.questions.should.be.a( "array" );
                    expect( res.body.data.questions.length ).to.equal( 2 );
                    expect( res.body.data.questions[ 0 ].title = "4Sum" );
                    expect( res.body.data.questions[ 1 ].title = "5Sum" );
                    done();
                } );
        } );
    } );


    describe( "GET /api/questions/", () => {
        it( "should get all questions with specified difficulty", ( done ) => {
            chai.request( app )
                .get( "/api/questions?difficulty=easy" )
                .end( ( err, res ) => {
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    res.body.data.questions.should.be.a( "array" );
                    expect( res.body.data.questions.length ).to.equal( 1 );
                    expect( res.body.data.questions[ 0 ].title = "5Sum" );
                    done();
                } );
        } );

        it( "should get all questions with specified offset", ( done ) => {
            chai.request( app )
                .get( "/api/questions?offset=1" )
                .end( ( err, res ) => {
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    res.body.data.questions.should.be.a( "array" );
                    expect( res.body.data.questions.length ).to.equal( 1 );
                    done();
                } );
        } );

        it( "should get all questions with specified limit", ( done ) => {
            chai.request( app )
                .get( "/api/questions?limit=1" )
                .end( ( err, res ) => {
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    res.body.data.questions.should.be.a( "array" );
                    expect( res.body.data.questions.length ).to.equal( 1 );
                    done();
                } );
        } );
    } );
} );

describe( "update question", () => {
    describe( "PUT /api/questions/:id", () => {
        it( "should update question 5Sum difficulty from easy to hard", ( done ) => {
            chai.request( app )
                .get( "/api/questions?difficulty=easy" )
                .end( ( err, res ) => {
                    const updateQuestionDifficulty = testData[ "put" ][ "updateQuestionDifficulty" ];
                    updateQuestionDifficulty.id = res.body.data.questions[ 0 ]._id;
                    
                    chai.request( app )
                        .put( "/api/questions/" + res.body.data.questions[ 0 ]._id )
                        .send( updateQuestionDifficulty )
                        .end( ( err, response ) => {
                            response.should.have.status( 200 );
                            expect( response.body.status ).to.equal( "success" );
                            done();
                        } );
                } );
        } );

        it( "should not return any easy questions", ( done ) => {
            chai.request( app )
                .get( "/api/questions?difficulty=easy" )
                .end( ( err, res ) => {
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    res.body.data.questions.should.be.a( "array" );
                    expect( res.body.data.questions.length ).to.equal( 0 );
                    done();
                } );
        } );

        it( "should return 1 hard question", ( done ) => {
            chai.request( app )
                .get( "/api/questions?difficulty=hard" )
                .end( ( err, res ) => {
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    res.body.data.questions.should.be.a( "array" );
                    expect( res.body.data.questions.length ).to.equal( 1 );
                    done();
                } );
        } );
    } );
} );

describe( "get random question for matchmaking", () => {
    it( "should return 1 random question", ( done ) => {
        chai.request( app )
            .get( "/api/questions/get_random_question" )
            .end( ( err, res ) => {
                res.should.have.status( 200 );
                expect( res.body.status ).to.equal( "success" );
                res.body.data.questions.should.be.a( "array" );
                expect( res.body.data.questions.length ).to.equal( 1 );
                done();
            } );
    } );
} );

describe( "delete all questions", () => {
    it( "should delete 1 question", ( done ) => {
        chai.request( app )
            .get( "/api/questions/" )
            .then( ( res ) => {
                const questionId = res.body.data.questions[ 0 ]._id;
                chai.request( app )
                    .delete( "/api/questions/" + questionId )
                    .send( {
                        id: questionId
                    } )
                    .end( ( err, response ) => {
                        response.should.have.status( 200 );
                        expect( response.body.status ).to.equal( "success" );
                        done();
                    } );
            } );
    } );

    it( "should delete another question", ( done ) => {
        chai.request( app )
            .get( "/api/questions/" )
            .then( ( res ) => {
                const questionId = res.body.data.questions[ 0 ]._id;
                chai.request( app )
                    .delete( "/api/questions/" + questionId )
                    .send( {
                        id: questionId
                    } )
                    .end( ( err, response ) => {
                        response.should.have.status( 200 );
                        expect( response.body.status ).to.equal( "success" );
                        done();
                    } );
            } );
    } );

    it( "should return 0 questions left", ( done ) => {
        chai.request( app )
            .get( "/api/questions/" )
            .end( ( err, res ) => {
                res.should.have.status( 200 );
                expect( res.body.status ).to.equal( "success" );
                res.body.data.questions.should.be.a( "array" );
                expect( res.body.data.questions.length ).to.equal( 0 );
                done();
            } );
    } );
} );