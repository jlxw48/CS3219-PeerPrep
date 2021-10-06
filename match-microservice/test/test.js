process.env.NODE_ENV = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const Match = require('../models/Match');
const testData = require('./testData');

chai.use(chaiHttp);
chai.should();

describe("GET /match/status", () => {
    describe("API status", () => {
        it("should get working status of Match microservice API", (done) => {
            chai.request(app)
                .get('/match/status')
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

describe("GET /match/interviews", () => {
    describe("Get total number of interviews", () => {
        describe("Get 1 total interview", () => {
            // mimic 2 users having an interview
            before(async () => {
                const firstUserInterviewDetails = new Match(testData.firstUserInterviewDetails);
                const secondUserInterviewDetails = new Match(testData.secondUserInterviewDetails);
                await firstUserInterviewDetails.save();
                await secondUserInterviewDetails.save();
            });

            it("should get total number of interviews equals to 1", (done) => {
                chai.request(app)
                    .get('/match/interviews')
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
                Match.deleteMany({})
                .then(result => {
                    done();
                })
                .catch(err => {
                    done(err);
                });
            });
        });

        describe("Get 3 total interviews", () => {
            // mimic several users having interviews
            before(async () => {
                const firstUserInterviewDetails = new Match(testData.firstUserInterviewDetails);
                const secondUserInterviewDetails = new Match(testData.secondUserInterviewDetails);
                const thirdUserInterviewDetails = new Match(testData.thirdUserInterviewDetails);
                const fourthUserInterviewDetails = new Match(testData.fourthUserInterviewDetails);
                const fifthUserInterviewDetails = new Match(testData.fifthUserInterviewDetails);
                const sixthUserInterviewDetails = new Match(testData.sixthUserInterviewDetails);
                await firstUserInterviewDetails.save().catch(err => console.log(err));
                await secondUserInterviewDetails.save().catch(err => console.log(err));
                await thirdUserInterviewDetails.save().catch(err => console.log(err));
                await fourthUserInterviewDetails.save().catch(err => console.log(err));
                await fifthUserInterviewDetails.save().catch(err => console.log(err));
                await sixthUserInterviewDetails.save().catch(err => console.log(err));
            });

            it("should get total number of interviews equals to 3", (done) => {
                chai.request(app)
                    .get('/match/interviews')
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
                Match.deleteMany({})
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

describe("POST /match/start_find", () => {
    describe("Find match for a user", () => {
        // insert user to mimic queueing
        before(async () => {
            const firstUserMatchDetails = new Match(testData.firstUserMatchDetails);
            await firstUserMatchDetails.save().catch(err => console.log(err));
        });

        it("should find match for 2 users queueing with the same difficulty", (done) => {
            const secondUserFindDetails = testData.secondUserFindDetails;
            chai.request(app)
                .post('/match/start_find')
                .send(secondUserFindDetails)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.partnerEmail.should.be.eql("user1@gmail.com");
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

    describe("Unable to find match for a user due to different difficulties", () => {
        // insert user to mimic queueing
        before(async () => {
            const firstUserMatchDetails = new Match(testData.firstUserMatchDetails);  // easy difficulty
            await firstUserMatchDetails.save().catch(err => console.log(err));
        });

        it("should find match for 2 users queueing with the same difficulty", (done) => {
            const thirdUserFindDetails = testData.thirdUserFindDetails;  // medium difficulty
            chai.request(app)
                .post('/match/start_find')
                .send(thirdUserFindDetails)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('failed');
                    res.body.data.message.should.be.eql("failed to find a match after 30s");
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

describe("GET /match/get_partner", () => {
    describe("Get partner of user", () => {
        describe("Successfully get partner of a user in an interview", () => {
            // mimic 2 users having an interview
            before(async () => {
                const firstUserInterviewDetails = new Match(testData.firstUserInterviewDetails);
                const secondUserInterviewDetails = new Match(testData.secondUserInterviewDetails);
                await firstUserInterviewDetails.save();
                await secondUserInterviewDetails.save();
            });

            it("should get partner of user1", (done) => {
                chai.request(app)
                    .get('/match/get_partner?email=user1@gmail.com')
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.status.should.be.eql('success');
                        res.body.data.partnerEmail.should.be.eql("user2@gmail.com");
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

        describe("Unable to get partner of a user due to user not in an interview", () => {
            it("should not return any partner", (done) => {
                chai.request(app)
                    .get('/match/get_partner?email=user1@gmail.com')
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(404);
                        res.body.should.be.a('object');
                        res.body.status.should.be.eql('failed');
                        res.body.data.message.should.be.eql("failed to retrieve partner details");
                        done();
                    });
            });
        });
    });
    
});

describe("DELETE /match/end_interview", () => {
    describe("End interview", () => {
        describe("Successfully delete interview details", () => {
            // mimic 2 users having an interview
            before(async () => {
                const firstUserInterviewDetails = new Match(testData.firstUserInterviewDetails);
                const secondUserInterviewDetails = new Match(testData.secondUserInterviewDetails);
                await firstUserInterviewDetails.save();
                await secondUserInterviewDetails.save();
            });

            it("should delete interview details for both users", (done) => {
                chai.request(app)
                    .delete('/match/end_interview?interviewId=615d93afdb4e069cbdfe114a')
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.status.should.be.eql('success');
                        res.body.data.message.should.be.eql("interview ended for both users");
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

        describe("Unable to delete interview details due to invalid interview id", () => {
            it("should not delete any interview details", (done) => {
                chai.request(app)
                    .delete('/match/end_interview?interviewId=615d93afdb4e069cbdfe114a')
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        res.should.have.status(404);
                        res.body.should.be.a('object');
                        res.body.status.should.be.eql('failed');
                        res.body.data.message.should.be.eql("interview id does not exist");
                        done();
                    });
            });
        });
    });
});
