const app = require('../testindex'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');
// const databaseName = 'supertest';
require('dotenv').config();
// const Presenter = require("../models/presenter");
const Request = require("../models/request");
const User = require("../models/request");


describe("User CRUD test", ()=>{
    // jest.useFakeTimers();

     beforeAll(async () => {
      await mongoose.connect(process.env.DBTEST_URL, { useCreateIndex: true,useNewUrlParser: true, useUnifiedTopology: true  });
    });

    afterAll(async () => {
        await User.deleteMany({username: { $ne: "jackptoke@gmail.com"}}).exec();
        await Request.deleteMany({_id: { $ne: "5e38e94ef267e62a0fe47a6d"}}).exec();
        await mongoose.connection.close();
    });

    it("should allow a user to request a new password", (done)=>{
        const newRequest = { "email": "jackptoke@gmail.com" } 
        request.post("/password/request")
        .send(newRequest)
        .expect(200, done);
    });

    it("should allow a user to request a new password", (done)=>{
        const newRequest = { "password": "leveleight", "uniqueKey": "a875226a-73dc-4813-85f3-60399455e7c2" } 
        request.post("/password/reset")
        .send(newRequest)
        .expect(200, done);
    });
});