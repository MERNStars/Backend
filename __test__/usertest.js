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

    it("should allower a user to be created through post and return a json", (done)=>{
        const newUser = {username: "jackptoke@msn.com", password: "groundzero", first_name: "Jack", last_name: "Toke", sex: "male", newsletter: true, age: 30, religion: "agnostic"}

        request.post("/users/create")
        .send(newUser)
        .expect(200, done);
    });

    it("should let user login and return a json", (done)=>{
        const user = { username: "jackptoke@gmail.com", password: "groundzero" };
        request.post("/users/login")
        .send(user)
        .expect(200, done);
        // done();
    });

     it("should not permit a user to be created without the username", (done)=>{
        const newUser = { first_name: "Jack", last_name: "Toke", sex: "male", newsletter: true, age: 30, religion: "athiest"}

        request.post("/users/create")
        .send(newUser)
        .expect(400, done);
    });

    it("should not allow a user to be created with incorrect sex/religion values", (done)=>{
        const newUser = {username: "jackptoke@yahoo.com", password: "groundzero", first_name: "Jack", last_name: "Toke", sex: "asdfasdf", newsletter: true, age: 30, religion: "asdfasdf"}

        request.post("/users/create")
        .send(newUser)
        .expect(500, done);
    });

    it("should return all users' detail", (done)=>{
        request.get("/users")
        .set('Authorization', token)
        .expect(200, done);
        // done();
    });

    it("should successfully return a user's detail", (done)=>{
        request.get("/users/jackptoke@msn.com")
        .set('Authorization', token)
        .expect(200, done);
    });

    it("should successfully user's detail", (done)=>{
        const newUser = {
            "username": "jackptoke@gmail.com",
            "password": "groundzero",
            "first_name": "Jack",
            "last_name": "Toke",
            "age": 37, 
            "religion": "agnostic",
            "interests": ["healthy cooking", "bible seminar"]
        };

        request.patch("/users/update")
        .send(newUser)
        .set('Authorization', token)
        .expect(200, done);
    });


    it("should delete a user", (done)=>{
        const newUser = {username: "jackptoke@xxx.com", password: "groundzero", first_name: "Jack", last_name: "Toke", sex: "male", newsletter: true, age: 30, religion: "agnostic"}

        request.post("/users/create")
        .send(newUser)
        .then(result => {
            request.delete("/users/delete/jackptoke@xxx.com")
            .set('Authorization', token)
            // .expect(200, done);
            .expect(200, done);
        });
    });
});
