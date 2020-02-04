const app = require('../index'); // Link to your server file
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
      await mongoose.connection.close();
      
    });

    it("should let user login and return a json", (done)=>{
        const user = { username: "jackptoke@gmail.com", password: "groundzero" };
        request.post("/users/login")
        .send(user)
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
afterAll(()=>{
  
})