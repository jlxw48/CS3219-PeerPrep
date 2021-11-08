process.env.NODE_ENV = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const Match = require('../models/Match');
const Interview = require('../models/Interview');
const testData = require('./testData');

chai.use(chaiHttp);
chai.should();

describe("GET /match/status", () => {
    describe("API status", () => {
        it("should get working status of Match microservice API", (done) => {
            chai.request(app)
                .get('/api/match/status')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.message.should.be.eql('match component is working');
                    done();
                });
        });
    });
});

describe("GET /match/get_interview", () => {
    describe("Get interview of user", () => {
        // mimic user having an interview
        before(async () => {
            const firstInterviewDetails = new Interview(testData.firstInterviewDetails);
            await firstInterviewDetails.save();
        });

        it("should get interview of user", (done) => {
            chai.request(app)
                .get(`/api/match/get_interview?email=${testData.firstInterviewDetails.firstUserEmail}`)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.interviewId.should.be.eql("615d93afdb4e069cbdfe114a");
                    done();
                });
        });

        after(done => {
            Interview.deleteMany({})
            .then(result => {
                done();
            })
            .catch(err => {
                done(err);
            });
        });
        
    });
    
});

describe("POST /match/start_find", () => {
    describe("Unable to find match for a user due to different difficulties", () => {
        // insert user to mimic queueing
        before(async () => {
            const firstUserFindDetails = new Match(testData.firstUserFindDetails);  // easy difficulty
            await firstUserFindDetails.save();
        });

        it("should not find match for 2 users queueing with different difficulties", (done) => {
            const thirdUserFindDetails = testData.thirdUserFindDetails;  // medium difficulty
            chai.request(app)
                .post('/api/match/start_find')
                .send(thirdUserFindDetails)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('failed');
                    res.body.data.message.should.be.eql("Failed to find a match after 30s, please try again later.");
                    done();
                });
        });

        after(done => {
            Match.deleteMany({})
            .then(result => {
                done();
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe("DELETE /api/match/stop_find", () => {
    describe("Stop finding match for a user who is currently finding a match", () => {
        // insert user to mimic queueing
        before(async () => {
            const firstUserFindDetails = new Match(testData.firstUserFindDetails);
            await firstUserFindDetails.save();
        });

        it("Stop finding match for user", (done) => {
            const firstUserStopFindDetails = testData.firstUserStopFindDetails;
            chai.request(app)
                .delete('/api/match/stop_find')
                .send(firstUserStopFindDetails)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(204);
                    done();
                });
        });

        after(done => {
            Match.deleteMany({})
            .then(result => {
                done();
            })
            .catch(err => {
                done(err);
            });
        });
    });
});

describe("DELETE /match/end_interview", () => {
    describe("End interview", () => {
        describe("Successfully delete interview details", () => {
            // mimic user having an interview
            before(async () => {
                const firstInterviewDetails = new Interview(testData.firstInterviewDetails);
                await firstInterviewDetails.save();
            });

            it("should delete interview details for user", (done) => {
                chai.request(app)
                    .delete(`/api/match/end_interview?email=${testData.firstInterviewDetails.firstUserEmail}`)
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.status.should.be.eql('success');
                        res.body.data.message.should.be.eql("interview ended for user");
                        done();
                    });
            });

            after(done => {
                Interview.deleteMany({})
                .then(result => {
                    done();
                })
                .catch(err => {
                    done(err);
                });
            });
        });

        describe("Unable to delete interview details due to user not having any interviews at the moment", () => {
            it("should not delete any interview details", (done) => {
                chai.request(app)
                    .delete(`/api/match/end_interview?email=${testData.firstUserFindDetails.email}`)
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(404);
                        res.body.should.be.a('object');
                        res.body.status.should.be.eql('failed');
                        res.body.data.message.should.be.eql("failed to end interview for user");
                        done();
                    });
            });
        });
    });
});

describe("GET /match/interviews", () => {
    describe("Get total number of interviews", () => {
        describe("Get 1 total interview", () => {
            // mimic 1 interview
            before(async () => {
                const firstInterviewDetails = new Interview(testData.firstInterviewDetails);
                await firstInterviewDetails.save();
            });

            it("should get total number of interviews equals to 1", (done) => {
                chai.request(app)
                    .get('/api/match/interviews')
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.status.should.be.eql('success');
                        res.body.data.count.should.be.eql(1);
                        done();
                    });
            });

            after(done => {
                Interview.deleteMany({})
                .then(result => {
                    done();
                })
                .catch(err => {
                    done(err);
                });
            });
        });

        describe("Get 3 total interviews", () => {
            // mimic 3 ongoing interviews
            before(async () => {
                const firstInterviewDetails = new Interview(testData.firstInterviewDetails);
                const secondInterviewDetails = new Interview(testData.secondInterviewDetails);
                const thirdInterviewDetails = new Interview(testData.thirdInterviewDetails);
                await firstInterviewDetails.save();
                await secondInterviewDetails.save();
                await thirdInterviewDetails.save();
            });

            it("should get total number of interviews equals to 3", (done) => {
                chai.request(app)
                    .get('/api/match/interviews')
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.status.should.be.eql('success');
                        res.body.data.count.should.be.eql(3);
                        done();
                    });
            });

            after(done => {
                Interview.deleteMany({})
                .then(result => {
                    done();
                })
                .catch(err => {
                    done(err);
                });
            });
        });
        
    })
    
});