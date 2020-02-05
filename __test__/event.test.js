const app = require('../testindex'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');
// const databaseName = 'supertest';
require('dotenv').config();
// const Presenter = require("../models/presenter");
const Event = require("../models/event");
const User = require("../models/user");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl91c2VybmFtZSI6ImphY2twdG9rZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1ODA3ODAwNDgsImV4cCI6MTU4MDg2NjQ0OH0.TZ_evDggc1RzmK4SrLzgZMV8CXyKkO6Jm1xqnLys9Lo";

describe("User CRUD test", ()=>{
    jest.useFakeTimers();

    beforeAll(async () => {
      await mongoose.connect(process.env.DBTEST_URL, { useCreateIndex: true,useNewUrlParser: true, useUnifiedTopology: true  });
    });

    afterAll(async () => {
        // await User.deleteMany({username: { $ne: "jackptoke@gmail.com"}}).exec();
        await mongoose.connection.close();
    });

    it("should retrieve all events", (done)=>{
        request.get("/events")
        .expect(200, done);
    });

    it("should query some events", (done)=>{
        request.get("/events/health,cooking")
        .expect(200, done);
    });

    it("should create an event into the database", (done)=>{

        const user = {username: "jackptoke@gmail.com", password: "leveleight"};
        request.post("/users/login")
        .send(user)
    
        .then(result => {
             const {token} = result.body;
            const newEvent = { 
                "is_family_friendly": true,
                "minimum_age": 10,
                "event_category": "bible seminar",
                "published": true,
                "status": "postponed",
                "images": [
                "https://weexplore2020.s3-ap-southeast-2.amazonaws.com/images/902cd94d-140c-4fae-a22e-ec136a675c59.jpeg"
                ],
                "event_capacity": 30,
                "attendee_count": 4,
                "event_name": "The Metal Man",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "event_date": {
                "begin": "2020-02-20T17:00:00",
                "end": "2020-02-20T19:00:00"
                },
                "registration_closed_date": "2020-01-28T00:00:00.000Z",
                "fee": [
                {
                    "type": "free",
                    "cost": 0
                }
                ],
                "presenters": ["5e3905cb8a1aec32831f432f"],
                "attendees": [{
                    "friends": [
                    "Test",
                    "Test"
                    ],
                    "attended": false,
                    "dependents": [{
                        "name": "Test",
                        "age": 15
                    }],
                    "username": "jackptoke@gmail.com"
                }]};
                request.post("/events/create")
                .send(newEvent)
                .set('Authorization', token)
                .expect(201, done);
               

                expect(result.statusCode).toBe(200);
                done();
        });
    });

    it("should retrieve all events, extract and id and get the detail of it.", (done)=>{
        request.get("/events")
        .then(result => {
            if(result.body.length > 0){
                const {_id} = result.body[0];
                request.get(`/events/${_id}/id`)
                .expect(200, done);
            }
        });
    });

    it("should retrieve all events, extract and id and update the attendees' detail of it.", (done)=>{
        request.get("/events")
        .then(result => {
            if(result.body.length > 0){
                const index = Math.floor(result.body.length * Math.random());
                const event = result.body[index];
                event.presenters = ["5e3905cb8a1aec32831f432f"];
                event.attendees = [{
                        "friends": [ "John", "Jack" ],
                        "attended": false,
                        "dependents": [{
                            "name": "Jake",
                            "age": 8
                    }]
                }];
                request.patch(`/events/update`)
                .send(event)
                .set('Authorization', token)
                .expect(200, done);
            }
        });
    });

    it("should retrieve all events, randomly extract an id and delete the event.", (done)=>{
        request.get("/events")
        .then(result => {
            if(result.body.length > 0){
                const index = Math.floor(result.body.length * Math.random());
                const {_id} = result.body[index];
               
                request.delete(`/events/delete/${_id}`)
                .set('Authorization', token)
                .expect(200, done);
            }
        });
    });

     it("should retrieve all events that are in the category that matches the keyword.", (done)=>{
        request.get("/events/category/bible")
        .expect(200, done);
    });

    it("should retrieve all events and randomly extract an id and publish the event.", (done)=>{
        request.get("/events")
        .then(result => {
            if(result.body.length > 0){
                const index = Math.floor(result.body.length * Math.random());
                const {_id} = result.body[index];
               
                request.patch(`/events/publish`)
                .send({_id: _id, published: true})
                .set('Authorization', token)
                .expect(200, done);
            }
        });
    });

    it("should retrieve all events and randomly extract an id and change the status of the event.", (done)=>{
        request.get("/events")
        .then(result => {
            if(result.body.length > 0){
                const index = Math.floor(result.body.length * Math.random());
                const {_id} = result.body[index];
               
                request.patch(`/events/status`)
                .send({_id: _id, status: "canceled"})
                .set('Authorization', token)
                .expect(200, done);
            }
        });
    });

    it("should retrieve all events and randomly extract an id and add an attendee detail.", (done)=>{
        request.get("/events")
        .then(result => {
            if(result.body.length > 0){
                const index = Math.floor(result.body.length * Math.random());
                const {_id} = result.body[index];
                const attendee = { _id: _id, username: "jackptoke@gmail.com", friends: ["Joe", "Peter"], dependents: [{name: "Josiah", age: 6},{name: "Jeremiah", age: 5}]};
                request.patch(`/events/attend`)
                .send(attendee)
                .set('Authorization', token)
                .expect(200, done);
            }
        });
    });

    it("should retrieve all events and randomly extract an id and remove an attendee from the event.", (done)=>{
        request.get("/events")
        .then(result => {
            if(result.body.length > 0){
                const index = Math.floor(result.body.length * Math.random());
                const {_id} = result.body[index];
                const attendee = { _id: _id, username: "jackptoke@gmail.com" };
                request.patch(`/events/unattend`)
                .send(attendee)
                .set('Authorization', token)
                .expect(200, done);
            }
        });
    });


    it("should retrieve all events and randomly extract an id and toggle his/her status for having attended the event.", (done)=>{
        request.get("/events")
        .then(result => {
            if(result.body.length > 0){
                const index = Math.floor(result.body.length * Math.random());
                const {_id} = result.body[index];
                const attendee = { _id: _id, username: "jackptoke@gmail.com" };
                request.patch(`/events/toggleAttended`)
                .send(attendee)
                .set('Authorization', token)
                .expect(200, done);
            }
        });
    });
});