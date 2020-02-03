const should = require("should"),
    request = require("supertest"),
    app = require("../index.js"),
    mongoose = require("mongoose"),
    User = mongoose.model("User"),
    agent = request.agent(app);

describe("User CRUD test", ()=>{

    it("should let user login and return a json", (done)=>{
        const user = { username: "jackptoke@gmail.com", password: "groundzero" };

        agent.post("/users/login")
        .send(user)
        .expect(200)
        .then(result => {
            // console.log(result.token);
            it("should succesfully return all users", (done)=>{
                agent.get("/users")
                .set('Authorization', result.token)
                .expect(200)
                .end((err, result)=>{
                    should.exist(result.body);
                });
            });
        })
        .catch(err => console.error(err));
        done();
    });
    
    afterEach((done)=>{
        User.deleteMany({username: { $ne: "jackptoke@gmail.com"}}).exec();
        done();
    });
})