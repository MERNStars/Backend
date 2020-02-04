const app = require('../testindex'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');
// const databaseName = 'supertest';
require('dotenv').config();
// const Presenter = require("../models/presenter");
const User = require("../models/user");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl91c2VybmFtZSI6ImphY2twdG9rZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1ODA3ODAwNDgsImV4cCI6MTU4MDg2NjQ0OH0.TZ_evDggc1RzmK4SrLzgZMV8CXyKkO6Jm1xqnLys9Lo";

describe("User CRUD test", ()=>{
    jest.useFakeTimers();

    beforeAll(async () => {
      await mongoose.connect(process.env.DBTEST_URL, { useCreateIndex: true,useNewUrlParser: true, useUnifiedTopology: true  });
    });

    afterAll(async () => {
        await User.deleteMany({username: { $ne: "jackptoke@gmail.com"}}).exec();
        await mongoose.connection.close();
    });

    it("should retrieve all events", (done)=>{

        request.get("/events")
        .expect(200, done);
    });
});