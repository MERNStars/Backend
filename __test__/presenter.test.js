const app = require('../testindex'); // Link to your server file
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');
// const databaseName = 'supertest';
require('dotenv').config();
const Presenter = require("../models/presenter");



describe("Presenter CRUD test", ()=>{

    beforeAll(async () => {
      await mongoose.connect(process.env.DBTEST_URL, { useCreateIndex: true,useNewUrlParser: true, useUnifiedTopology: true  });
    });

    afterAll(async () => {
      await Presenter.deleteMany({ _id: { $ne: "5e3905cb8a1aec32831f432f"} }).exec();
      await mongoose.connection.close();
      
    });

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl91c2VybmFtZSI6ImphY2twdG9rZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1ODA3OTAwNzYsImV4cCI6MTU4MDg3NjQ3Nn0.A8P485MgtZlVzdU5IKy3DMCghtM_kjgjsfXqU7SJxx8";
    // it("should let user login and return a json", (done)=>{
    //     const user = { username: "jackptoke@gmail.com", password: "groundzero" };
    //     request.post("/users/login")
    //     .send(user)
    //     .expect(200, done);
    //     // done();
    // });

    it("should return information of all the presenters", (done)=>{
        request.get("/presenters")
        .expect(200, done);
        // done();
    });

    it("should create a new record of presenter and delete it afterward", (done)=>{
        const newPresenter = { first_name: "Jimmy", last_name: "Lam", title: "Dr", type: "presenter", qualification: "General Practitioner, MD", short_description: "World Class Physician", long_description: "Dr. Jimmy is pro", avatar: "test.jpg"}

        request.post("/presenters/create")
        .send(newPresenter)
        .set('Authorization', token)
        .then(result => {
          const {_id} = result.body;
          request.delete("/presenters/delete")
          .send({_id: _id})
          .set('Authorization', token)
          .expect(200, done);
        })
        // done();
    });

    it("should update the detail of the presenters", (done)=>{
      const newPresenter = { _id: "5e3905cb8a1aec32831f432f", first_name: "James", last_name: "Bond", title: "Dr", type: "presenter", qualification: "General Practitioner, MD", short_description: "World Class Physician", long_description: "Dr. Jimmy is pro", avatar: "test.jpg" };

      request.patch("/presenters/update")
      .send(newPresenter)
      .set('Authorization', token)
      .expect(200, done);
      // done();
    });

    it("should update the detail of the presenters", (done)=>{
      const newPresenter = { _id: "5e3905cb8a1aec32831f432f" };

      request.get("/presenters/5e3905cb8a1aec32831f432f")
      .expect(200, done);
      // done();
    });

    it("should find a presetner", (done)=>{
      const query = "J";

      request.get(`/presenters/find/${query}`)
      .set('Authorization', token)
      .expect(200, done);
      // done();
    });

    it("should find many presenters", (done)=>{
      const query = "5e3905cb8a1aec32831f432f";

      request.get(`/presenters/findMany/${query}`)
      .set('Authorization', token)
      .expect(200, done);
      // done();
    });

    it("should delete the detail of the presenters", (done)=>{
      const newPresenter = { _id: "5e3905cb8a1aec32831f432f" };

      request.get("/presenters/5e3905cb8a1aec32831f432f")
      .expect(200, done);
      // done();
    });
});

// async function removeAllCollections () {
//   const collections = Object.keys(mongoose.connection.collections)
//   for (const collectionName of collections) {
//     const collection = mongoose.connection.collections[collectionName]
//     await collection.deleteMany()
//   }
// }

// afterEach(async () => {
//   await removeAllCollections()
// })