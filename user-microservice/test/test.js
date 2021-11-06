process.env.NODE_ENV = "test";

const chai = require( "chai" );
const chaiHttp = require( "chai-http" );

const app = require( "../index" );
const User = require( "../models/User" );
const testData = require( "../dummyTestData/dummyUsers" );

const expect = chai.expect;
const should = chai.should();
chai.use( chaiHttp );

describe( "add 2 users", () => {
    before( ( done ) => {
        User.deleteMany( {}, ( err ) => {
            done();
        } );
    } );

    describe( "POST /user/create_account/", () => {
        it( "should add 1 user", ( done ) => {
            chai.request( app )
                .post( '/api/user/create_account')
                .send({
                    name: testData.validUser1.name,
                    email: testData.validUser1.email,
                    password: testData.validUser1.password
                })
                .end( ( err, res ) => {
                    console.log(res);
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 201 );
                    res.body.should.be.a('object');
                    expect( res.body.status ).to.equal( "success" );
                    res.body.data.message.should.be.eql("Account created");
                    done();
                } );
        } );

        it( "should add another user", ( done ) => {
            chai.request( app )
                .post( '/api/user/create_account')
                .send({
                    name: testData.validUser2.name,
                    email: testData.validUser2.email,
                    password: testData.validUser2.password
                })
                .end( ( err, res ) => {
                    console.log(res);
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 201 );
                    res.body.should.be.a('object');
                    expect( res.body.status ).to.equal( "success" );
                    res.body.data.message.should.be.eql("Account created");
                    done();
                } );
        } );
    } );
} );

describe( "login 2 users", () => {
    describe( "POST /user/user_login/", () => {
        it( "should login 1 user", ( done ) => {
            chai.request( app )
                .post( '/api/user/user_login')
                .send({
                    email: testData.validUser1.email,
                    password: testData.validUser1.password
                })
                .end( ( err, res ) => {
                    console.log(res);
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    done();
                } );
        } );

        it( "should login another user", ( done ) => {
            chai.request( app )
                .post( '/api/user/user_login')
                .send({
                    email: testData.validUser2.email,
                    password: testData.validUser2.password
                })
                .end( ( err, res ) => {
                    console.log(res);
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    done();
                } );
        } );
    } );
} );

describe( "logout 2 users", () => {
    describe( "POST /user/user_logout/", () => {
        it( "should logout 1 user", ( done ) => {
            chai.request( app )
                .post( '/api/user/user_logout')
                .send({
                    email: testData.validUser1.email,
                })
                .end( ( err, res ) => {
                    console.log(res);
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    done();
                } );
        } );

        it( "should login another user", ( done ) => {
            chai.request( app )
                .post( '/api/user/user_logout')
                .send({
                    email: testData.validUser2.email,
                })
                .end( ( err, res ) => {
                    console.log(res);
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status( 200 );
                    expect( res.body.status ).to.equal( "success" );
                    done();
                } );
        } );
    } );
} );