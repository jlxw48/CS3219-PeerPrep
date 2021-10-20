process.env.NODE_ENV = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const Chat = require('../models/Chat');
const testData = require('./testData');

chai.use(chaiHttp);
chai.should();

describe("GET /chat/status", () => {
    describe("API status", () => {
        it("should get working status of Chat microservice API", (done) => {
            chai.request(app)
                .get('/chat/status')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.message.should.be.eql('chat component is working');
                    done();
                });
        });
    });
});

describe("GET /chat/get_messages/:interviewId", () => {
    describe("Get chat history for interview id", () => {
        // insert chat history
        before(async () => {
            const firstInterviewIdDetails = new Chat(testData.firstInterviewIdDetails);
            await firstInterviewIdDetails.save().catch(err => console.log(err));
        });

        it("should return chat history", (done) => {
            const firstInterviewId = testData.firstInterviewId;
            chai.request(app)
                .get(`/chat/get_messages/${firstInterviewId}`)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('success');
                    res.body.data.history.should.be.a('array');
                    res.body.data.history.should.have.length(7);
                    done();
                });
        });

        after(done => {
            Chat.deleteMany({})
            .then(result => {
                done();
            })
            .catch(err => {
                done(err);
            });
        });
    });

    describe("Unable to get chat history due to invalid interviewId", () => {
        it("should not get chat history for invalid interview id", (done) => {
            const secondInterviewId = testData.secondInterviewId;
            chai.request(app)
                .get(`/chat/get_messages/${secondInterviewId}`)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.status.should.be.eql('failed');
                    res.body.data.message.should.be.eql("chat history of interview id not found");
                    done();
                });
        });
    });
});
