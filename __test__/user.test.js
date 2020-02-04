const app = require('../index'); // Link to your server file
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



    // it("should succesfully change the subscription status to true", (done)=>{
    //     request.patch("/users/subscribe")
    //     .set('Authorization', token)
    //     .expect(200)
    //     .end((err, result)=>{
    //         result.body.success.should.ok();
    //     });
    // });
        // .then(result => {
            // console.log(result.token);
           

           

            // it("should succesfully change the newletter subscription to false", (done)=>{
            //     request.get("/users/unsubscribe")
            //     .set('Authorization', result.token)
            //     .expect(200)
            //     .end((err, result)=>{
            //         result.body.success.should.ok();
            //     });
            // });

            // it("should succesfully learve a remark about the user", (done)=>{
            //     request.get("/users/remark")
            //     .send({username: "jackptoke@gmail.com", remark: "Hello...there!"})
            //     .set('Authorization', result.token)
            //     .expect(200)
            //     .end((err, result)=>{
            //         result.body.success.should.ok();
            //     });
            // });

            // it("should succesfully update the user's detail", (done)=>{
            //     request.get("/users/update")
            //     .send({ username: "jackptoke@gmail.com", first_name: "James", last_name: "Jones", sex: "male", age: 25, religion: "seventh-day adventist", newsletter: true, interests: ["health cooking"], remarks: "He's a good guy" } )
            //     .set('Authorization', result.token)
            //     .expect(200)
            //     .end((err, result)=>{
            //         result.body.success.should.ok();
            //     });
            // });

            // it("should succesfully update the user's detail", (done)=>{
            //     request.get("/users/changePassword")
            //     .send({ username: "jackptoke@gmail.com", password: "groundzero" } )
            //     .set('Authorization', result.token)
            //     .expect(200)
            //     .end((err, result)=>{
            //         result.body.success.should.ok();
            //     });
            // });

            // it("should return true if user is there, otherwise false", (done)=>{
            //     request.get("/users/exists")
            //     .send({ username: "jackptoke@gmail.com" } )
            //     .set('Authorization', result.token)
            //     .expect(200)
            //     .end((err, result)=>{
            //         result.body.success.should.ok();
            //     });
            // });

            // it("should return true if user is there, otherwise false", (done)=>{
            //     request.get("/users/exists")
            //     .send({ username: "jackptoke@xxx.com" } )
            //     .set('Authorization', result.token)
            //     .expect(200)
            //     .end((err, result)=>{
            //         result.body.exists.should.not.ok();
            //     });
            // });
        // });
    
    // afterEach((done)=>{
    //     User.deleteMany({username: { $ne: "jackptoke@gmail.com"}}).exec();
    //     done();
    // });