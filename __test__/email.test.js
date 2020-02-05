const app = require('../testindex'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');
// const databaseName = 'supertest';
require('dotenv').config();
// const Presenter = require("../models/presenter");
const Event = require("../models/event");
const User = require("../models/user");


describe("User CRUD test", ()=>{
    jest.useFakeTimers();
    
    beforeAll(async () => {
      await mongoose.connect(process.env.DBTEST_URL, { useCreateIndex: true,useNewUrlParser: true, useUnifiedTopology: true  });
    });

    afterAll(async () => {
        // await User.deleteMany({username: { $ne: "jackptoke@gmail.com"}}).exec();
        await mongoose.connection.close();
    });

    it("should send an email", (done)=>{
        const mail = {name: "James", email: "jackptoke@msn.com", subject: "Greeting", text: "I'm in Melbourne and saying hello." }

        request.post("/email")
        .send(mail)
        .expect(200, done);
    });
});