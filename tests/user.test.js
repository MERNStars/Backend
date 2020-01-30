const supertest = require('supertest');
const Users = require('../models/user');
const app = require('../server');
const env = require("gulp-env");


describe("Testing the User's API", () => {
  // Testing the POST /login endpoint
    // it("tests the user login.  it should return a json", async () => {

    //   const response = await supertest(app).post('/users/login').send({
    //     username: 'jackptoke@gmail.com',
    //     password: 'leveleight'
    //   });

    //   expect(response.status).toBe(200);
    //   expect(response.body.success).toBe(true);
    //   expect(response.body.message).toBe('Authentication successful');
    // });
     it("tests our testing framework if it works", () => {
    expect(2).toBe(2);
  });
});
