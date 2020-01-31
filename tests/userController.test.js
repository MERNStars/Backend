const should = require("should");
const sinon = require("sinon");

describe("User controller test", ()=>{
    describe("createUser", ()=>{
        it("Should not allowed empty username on post", ()=>{
            var User = (user) => { this.save = ()=>{}};

            var req = {
                body: {
                    username: "jackptoke"
                }
            }

            var res = {
                status: sinon.spy(), 
                send: sinon.spy()
            }

            const userController = require("../controllers/user_controllers")(User);

            userController.post(req, res);
            
            res.status.calledWith(400).should.equal(true, "Bad status " + res.status.args[0]);

            res.send.calledWith("username is required").should.equal(true);       

        })
    })
})