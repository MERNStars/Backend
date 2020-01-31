const should = require("should"),
    request = require("supertest"),
    app = require("../index.js"),
    mongoose = require("mongoose"),
    User = mongoose.model("User"),
    agent = request.agent(app);

describe("User CRUD test", ()=>{
    

    it("should all a user to be created through post and return a json", (done)=>{
        const newUser = { first_name: "Jack", last_name: "Toke", sex: "male", newsletter: true, age: 30, religion: "athiest"}

        agent.post("/users/create")
        .send(newUser)
        .expect(400, done);
    });

    it("should all a user to be created through post and return a json", (done)=>{
        const newUser = {username: "jackptoke@msn.com", password: "groundzero", first_name: "Jack", last_name: "Toke", sex: "male", newsletter: true, age: 30, religion: "agnostic"}

        agent.post("/users/create")
        .send(newUser)
        .expect(200)
        .end((err, result)=>{
            result.body.success.should.equal(true);
            result.body.message.should.equal("Account created");
        });
        done();
    });

    it("should all a user to be created through post and return a json", (done)=>{
        const newUser = {username: "jackptoke@msn.com", password: "groundzero", first_name: "Jack", last_name: "Toke", sex: "asdfasdf", newsletter: true, age: 30, religion: "asdfasdf"}

        agent.post("/users/create")
        .send(newUser)
        .expect(500)
        .end((err, result)=>{
            result.body.success.should.equal(true);
            result.body.message.should.equal("Account created");
        });
        done();
    });

    afterEach((done)=>{
        User.remove().exec();
        done();
    });
})