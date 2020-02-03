const should = require("should"),
    request = require("supertest"),
    app = require("../index.js"),
    mongoose = require("mongoose"),
    User = mongoose.model("User"),
    agent = request.agent(app);

describe("User CRUD test", ()=>{
    
    let token = "";
    it("should not permit a user to be created without the username", (done)=>{
        const newUser = { first_name: "Jack", last_name: "Toke", sex: "male", newsletter: true, age: 30, religion: "athiest"}

        agent.post("/users/create")
        .send(newUser)
        .expect(400)
        .end((err, result)=>{
            result.body.success.should.not.be.ok();
            result.body.message.should.equal("Username is required");
        });
        done();
    });

    it("should allower a user to be created through post and return a json", (done)=>{
        const newUser = {username: "jackptoke@msn.com", password: "groundzero", first_name: "Jack", last_name: "Toke", sex: "male", newsletter: true, age: 30, religion: "agnostic"}

        agent.post("/users/create")
        .send(newUser)
        .expect(200)
        .end((err, result)=>{
            // console.log(result);
            result.body.success.should.ok();
            result.body.message.should.equal("Account created");
        });
        done();
    });

    it("should not allow a user to be created with incorrect sex/religion values", (done)=>{
        const newUser = {username: "jackptoke@yahoo.com", password: "groundzero", first_name: "Jack", last_name: "Toke", sex: "asdfasdf", newsletter: true, age: 30, religion: "asdfasdf"}

        agent.post("/users/create")
        .send(newUser)
        .expect(500)
        .end((err, result)=>{
            result.body.success.should.not.be.ok();
            result.body.message.should.equal("Incorrect data type or value");
        });
        done();
    });

    it("should let user login and return a json", (done)=>{
        const user = { username: "jackptoke@gmail.com", password: "groundzero" }

        agent.post("/users/login")
        .send(user)
        .expect(201)
        .end((err, result)=>{
            // should(result.body.success).be.ok();
            // console.log(result.body.token);
            result.body.should.have.keys('success');
            result.body.should.have.keys('token');
            token = result.body.token;
            // result.body.message.should.equal("Authentication successful");
        });
        done();
    });

    it("should fail to return user's detail", (done)=>{
        agent.get("/users")
        .set('Authorization', token)
        .expect(403)
        .end((err, result)=>{
            result.body.success.should.not.ok();
            result.body.message.should.equal("Your action is unauthorized");
            // result.body.message.should.equal("Incorrect data type or value");
        })
        .catch(err => console.err(err));
        done();
    });

      it("should fail to return user's detail", (done)=>{
        agent.get("/users/jackptoke@gmail.com")
        .set('Authorization', token)
        .expect(200)
        .end((err, result)=>{
            should.exist(result.body);
        });
        done();
    });
    //
    afterEach((done)=>{
        User.deleteMany({username: { $ne: "jackptoke@gmail.com"}}).exec();
        done();
    });

    // afterAll((done) => {
    //     User.deleteMany().exec();
    //     mongoose.disconnect(done);
    //      done();
    // });
})