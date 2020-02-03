const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const index = (req, res) => {
    const {token_username, isAdmin} = req.decoded;
    console.log("Getting all users...!");
    User.find({}, "username first_name last_name sex isAdmin email age religion newsletter interests", (err, users) => {
      if(err){
          res.status(400).send({
            success: false,
            message: 'Ooops!  Something went terribly wrong.'});
      }
      if (users === null) {
          res.status(400).send({
              success: false,
              message: 'There is nothing in the database'
          });
      }
      //Only Admin is allowed to have full access to user's detail
      else if(isAdmin){
          res.status(200).json(users);
      }
      else {
          res.status(403).send({
              success: false,
            message: 'Your action is unauthorized'
          })
      }
    });

    return res;
}

const createUser = (req, res) => {
  const { username, password, first_name, last_name, sex, age, religion, newsletter, interests} = req.body;
    //create a new user
    const newUser = new User({
      username, 
      password: "temp",
      first_name, 
      last_name, 
      sex,
      age,
      religion,
      newsletter,
      interests
    });

    if(!username){
        res.status(400);
        res.json({ success: false, message: "Username is required" });
    }
    else{

    //set an encrypted password from the password provided
        newUser.setPassword(password);
        //save the document
        newUser.save()
        .then(()=>{
            res.status(200);
            res.json({success: true, message: `Account created`});
        })//return the result
        .catch(err=> {
            res.status(500);
            res.json({success: false, message: `Incorrect data type or value`});
        });
    }
    return res;
}

const deleteUser = (req, res)=> {
    //find the user with the username and delete the document
    const {username} = req.params;
    const {token_username, isAdmin} = req.decoded;
    
    User.findOne({username: username}, (err, user) => {
        if (user === null) {
            res.status(400).send({
                success: false,
                message: 'User not found.'
            });
        }//User can only delete his/her own account unless he/she is an admin
        else if(isAdmin || token_username === username){
            user.remove()
            .then(()=> res.status(200).json('Your account has been deleted.  We are sorry to see you go.'))
            .catch(err => res.status(400).json('Error: ' + err));
        }
        else {
            res.status(403).send({
              message: 'Your action is unauthorized'
            })
        }
    });

    return res;
};

const findUserByUsername = (req, res)=> {
//find the user with the specified username and return all the detail
//in the response JSON payload
    const {username} = req.params;
    const {token_username, isAdmin} = req.decoded;
    
    User.findOne({username: username}, "username first_name last_name sex isAdmin email age religion newsletter interests", (err, user) => {
        if (user === null) {
            res.status(400);
            res.send({
                success: false,
                message: 'User not found.'
            });
        }//User can only retrieve his/her own account or information
        //unless the user is an admin
        else if(isAdmin || token_username === username){
            res.status(200);
            res.json(user);
        }
        else {
            res.status(403);
            res.send({
              message: 'Your action is unauthorized'
            })
        }
    });

    return res;
};

const login = (req, res) => {
  const {username, password} = req.body;
  //find the specified user
  User.findOne({username : username }, function(err, user) {
    if (user === null) {
      res.status(400);
      res.send({
        success: false,
        message: 'User not found.'
      });
    }
    else {
      if (user.validPassword(password)) {
        let token = jwt.sign({token_username: username, isAdmin: user.isAdmin},
          process.env.TOKEN_SECRET,
          {expiresIn: '24h'})

        res.status(200);
        res.json({
          success: true,
          message: 'Authentication successful',
          isAdmin: user.isAdmin,
          token: token
        });
      }
      else {
        res.status(400);
        res.json({
            success: false,
            message: 'Wrong Password'
        })
      }
    }
  })
  return res
}

const subscribe = (req, res) => {
    //find the user with the specified username and change his/her newsletter to true
    //indicating the person is willing to receive newsletter
    const {username} = req.params;
    const {token_username, isAdmin} = req.decoded;
    //find the specified user
    User.findOne({username: username}, (err, user) => {
        if (user === null) {
            res.status(400);
            res.send({
                success: false,
                message: 'User not found.'
            });
        }
        //User changes his/her status to receive newsletter to true
        //Admin user can update anyone's subscription
        else if(isAdmin || token_username === username){
            user.newsletter = true;
            user.save()
            .then(() => {
                res.status(200)
                res.json({success: true, message: `${username} has successfully subscribed to WeExplore newsletter.`})
            })
            .catch((err) => { 
                res.status(400);
                res.json({success: false, message: `${username} has failed to subscribe to WeExplore newsletter.`
                })
            });
        }
        else {
            res.status(403);
            res.send({
              message: 'Your action is unauthorized'
            });
        }
    });

    return res;
}

const unsubscribe = (req, res) => {
    //find the user with the specified username and change his/her newsletter to false
    //indicating the person is NOT willing to receive newsletter
    const {username} = req.params;

    const {token_username, isAdmin} = req.decoded;
    //find the specified user
    User.findOne({username: username}, (err, user) => {
        if (user === null) {
            res.status(400).send({
                success: false,
                message: 'User not found.'
            });
        }
        //User changes his/her status to receive newsletter to true
        //Admin user can update anyone's subscription
        else if(isAdmin || token_username === username){
            user.newsletter = false;
            user.save()
            .then(() => res.status(200).json({success: true, message: `${username} has successfully unsubscribed to WeExplore newsletter.`}))
            .catch((err) => res.status(400).json({success: false, message: `${username} has failed to unsubscribe to WeExplore newsletter.`}))
        }
        else {
            res.status(403).send({
              message: 'Your action is unauthorized'
            })
        }
    });

    return res;
}

const makeRemark = (req, res) => {
    //find the user with the specified username and change his/her newsletter to false
    //indicating the person is NOT willing to receive newsletter

    //find the specified user
    const {username, remarks} = req.body;
    User.findOne({username: username}, (err, user) => {
        if (user === null) {
            res.status(400).send({
                success: false,
                message: 'User not found.'
            });
        }
        //Only Admin can leave remarks about a user
        //User will not see the note themselves
        else if(req.decoded['isAdmin']){
            
            user.remarks = remarks;
            user.save()
            .then(() => res.status(200).json({success: true, message: `You have successfully leave a remark about ${username}.`}))
            .catch((err) => res.status(400).json({success: false, message: `You have failed to leave any remark about ${username}.`}))
        }
        else {
            res.status(403).send({
              message: 'Your action is unauthorized'
            })
        }
    });

    return res;
}

const update = (req, res) => {
    const { username, first_name, last_name, sex, age, religion, newsletter, interests, remarks } = req.body;
    const {isAdmin, token_username} = req.decoded;

    //A person can only change his/her own detail unless he/she is an admin
    if(!(isAdmin || token_username === user))//if 
        return res.status(400).json({success: false, message: "You don't have the administrative rights to carryout this update."});

    User.updateOne({username: username}, {first_name: first_name, last_name: last_name, sex: sex, religion: religion, age: age, interests: interests, newsletter: newsletter, remarks: remarks}, 
        (err, result) =>{
        if(err){
            res.status(400).json(err)
        }
        
        if(result.n > 0)
            res.status(200).json(result);
        else
            res.status(400).json(result);
    })
    .catch(err => res.status(400).json(err));
    return res;
}

const changePassword = (req, res) => {
    const {username, password} = req.body;
    const {token_username, isAdmin} = req.decoded;
    //find the specified user
    User.findOne({username: username}, (err, user) => {
        if (user === null) {
            res.status(400).send({
                success: false,
                message: 'User not found.'
            });
        }
        //User can update his/her own password
        //Only admin can update everyone else password
        else if(isAdmin || token_username === username){
            user.setPassword(password);
            user.save()
            .then(() => res.status(200).json({success: true, message: `You have successfully updated the password of ${username}.`}))
            .catch((err) => res.status(400).json({success: false, message: `You have failed to update the password of ${username}.`}))
        }
        else {
            res.status(403).send({
              message: 'Your action is unauthorized'
            })
        }
    });

    return res;
}

const accountExists = (req, res) => {
    const {username} = req.body;
    User.findOne({username: username}, (err, result) =>{
        if(err){
            res.status(500).json({success: false, message: "We encounter problem while trying to query the database.  Please, try again later."})
        }
        if(result)
            res.status(200).json({exists: true, message: `The account (${username}) is already in the system.`})
        else{
            res.status(200).json({exists: false, message: `The account (${username}) isn't in the system yet.  It's available.`});
        }
    });
    return res;
}

module.exports = { index, createUser, deleteUser, findUserByUsername, login, subscribe, unsubscribe, makeRemark, update, changePassword, accountExists }