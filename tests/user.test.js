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

            it("should succesfully change the subscription status to true", (done)=>{
                agent.get("/users/subscribe")
                .set('Authorization', result.token)
                .expect(200)
                .end((err, result)=>{
                    result.body.success.should.ok();
                });
            });

            it("should succesfully change the newletter subscription to false", (done)=>{
                agent.get("/users/unsubscribe")
                .set('Authorization', result.token)
                .expect(200)
                .end((err, result)=>{
                    result.body.success.should.ok();
                });
            });

            it("should succesfully learve a remark about the user", (done)=>{
                agent.get("/users/remark")
                .send({username: "jackptoke@gmail.com", remark: "Hello...there!"})
                .set('Authorization', result.token)
                .expect(200)
                .end((err, result)=>{
                    result.body.success.should.ok();
                });
            });

            it("should succesfully update the user's detail", (done)=>{
                agent.get("/users/update")
                .send({ username: "jackptoke@gmail.com", first_name: "James", last_name: "Jones", sex: "male", age: 25, religion: "seventh-day adventist", newsletter: true, interests: ["health cooking"], remarks: "He's a good guy" } )
                .set('Authorization', result.token)
                .expect(200)
                .end((err, result)=>{
                    result.body.success.should.ok();
                });
            });

            it("should succesfully update the user's detail", (done)=>{
                agent.get("/users/changePassword")
                .send({ username: "jackptoke@gmail.com", password: "groundzero" } )
                .set('Authorization', result.token)
                .expect(200)
                .end((err, result)=>{
                    result.body.success.should.ok();
                });
            });

            it("should return true if user is there, otherwise false", (done)=>{
                agent.get("/users/exists")
                .send({ username: "jackptoke@gmail.com" } )
                .set('Authorization', result.token)
                .expect(200)
                .end((err, result)=>{
                    result.body.success.should.ok();
                });
            });

            it("should return true if user is there, otherwise false", (done)=>{
                agent.get("/users/exists")
                .send({ username: "jackptoke@xxx.com" } )
                .set('Authorization', result.token)
                .expect(200)
                .end((err, result)=>{
                    result.body.exists.should.not.ok();
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