process.env.NODE_ENV = "test";

const stubServer = require("./stub/index");
const chai = require( "chai" );
const chaiHttp = require( "chai-http" );

const app = require( "../index" );
const testData = require( "./testData" );

const expect = chai.expect;
const should = chai.should();
chai.use( chaiHttp );

describe( "add 2 interviews", () => {

    describe( "POST /api/editor/save-text/", () => {
        it( "should save text once", ( done ) => {
            chai.request( app )
                .post('/api/editor/save-text')
                .send({
                    interviewId: testData.validSession1.interviewId,
                    text: testData.validSession1.text
                })
                .end( ( err, res ) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 201 );
                    res.body.should.be.a('object');
                    expect( res.body.status ).to.equal( "success" );
                    done();
                } );
        } );

        it( "should save text again", ( done ) => {
            chai.request( app )
                .post( '/api/editor/save-text')
                .send({
                    interviewId: testData.validSession2.interviewId,
                    text: testData.validSession2.text
                })
                .end( ( err, res ) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 201 );
                    res.body.should.be.a('object');
                    expect( res.body.status ).to.equal( "success" );
                    done();
                } );
        } );
    } );
} );

describe( "get text from interviewId", () => {
    describe( "GET /api/editor/get_text/", () => {
        it( "should get session 1 text", ( done ) => {
            chai.request( app )
                .get( '/api/editor/get_text')
                .query({
                    interviewId: testData.validSession1.interviewId
                })
                .end( ( err, res ) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 200 );
                    expect(res.body.status).to.equal("success");
                    expect(res.body.data.message).to.equal("session1Text");
                    done();
                } );
        } );

        it( "should get session 2 text", ( done ) => {
            chai.request( app )
                .get( '/api/editor/get_text')
                .query({
                    interviewId: testData.validSession2.interviewId,
                })
                .end( ( err, res ) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 200 );
                    expect(res.body.status).to.equal("success");
                    expect(res.body.data.message).to.equal("session2Text");
                    done();
                } );
        } );
    } );
} );

describe( "delete text stored with interviewId", () => {
    describe( "DELETE /api/editor/end-session/", () => {
        it( "should delete session 1 stored text", ( done ) => {
            chai.request( app )
                .delete( '/api/editor/end-session')
                .query({
                    interviewId: testData.validSession1.interviewId
                })
                .end( ( err, res ) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 200 );
                    expect(res.body.status).to.equal("success");
                    expect(res.body.data.message).to.equal("Session successfully deleted: 1");
                    done();
                } );
        } );

        it( "should delete session 2 stored text", ( done ) => {
            chai.request( app )
                .delete( '/api/editor/end-session')
                .query({
                    interviewId: testData.validSession2.interviewId,
                })
                .end( ( err, res ) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 200 );
                    expect(res.body.status).to.equal("success");
                    expect(res.body.data.message).to.equal("Session successfully deleted: 2");
                    done();
                } );
        } );
    } );
} );