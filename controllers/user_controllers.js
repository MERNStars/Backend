const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const index = async (req, res) => {
    const {token_username, isAdmin} = await req.decoded;
    console.log("Getting all users...!");
    User.find({}, (err, users) => {
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
      else if(isAdmin || token_username === username){
          res.status(200).json(users);
      }
      else {
          res.status(403).send({
            message: 'Your action is unauthorized'
          })
      }
    });

    return res;
}

const createUser = async(req, res) => {
  const { username, password, isAdmin, email, age, religion, interests, remarks } = await req.body;
    //create a new user
    const newUser = new User({
      username, 
      password: "temp", 
      isAdmin, 
      email,
      age,
      religion,
      interests,
      remarks
    })
    //set an encrypted password from the password provided
    newUser.setPassword(password);
    //save the document
    newUser.save()
    .then(()=>res.status(201).json(`User account ${username} has been created!`))//return the result
    .catch(err=> res.status(400).json('Error: ' + err));
}

const deleteUser = async (req, res)=> {
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

const findOneUser = async (req, res)=> {
//find the user with the specified username and return all the detail
//in the response JSON payload
    const {username} = req.params;
    const {token_username, isAdmin} = req.decoded;
    
    User.findOne({username: username}, (err, user) => {
        if (user === null) {
            res.status(400).send({
                success: false,
                message: 'User not found.'
            });
        }//User can only retrieve his/her own account or information
        //unless the user is an admin
        else if(isAdmin || token_username === username){
            res.status(200).json(user);
        }
        else {
            res.status(403).send({
              message: 'Your action is unauthorized'
            })
        }
    });

    return res;
};

const login = async (req, res) => {
  const {username, password} = await req.body;
  //find the specified user
  User.findOne({username : username }, function(err, user) {
    if (user === null) {
      res.status(400).send({
        message: 'User not found.'
      });
    }
    else {
      if (user.validPassword(password)) {
        let token = jwt.sign({token_username: username, isAdmin: user.isAdmin},
          process.env.TOKEN_SECRET,
          {expiresIn: '24h'})

        res.status(201).json({
          success: true,
          message: 'Authentication successful',
          token: token
        });
      }
      else {
        res.status(400).send({
          message: 'Wrong Password'
        })
      }
    }
  })
  return res
}

const subscribe = async (req, res) => {
    //find the user with the specified username and change his/her newsletter to true
    //indicating the person is willing to receive newsletter
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
            user.newsletter = true;
            user.save()
            .then(() => res.status(200).json({success: true, message: `${username} has successfully subscribed to WeExplore newsletter.`}))
            .catch((err) => res.status(400).json({success: false, message: `${username} has failed to subscribe to WeExplore newsletter.`}))
        }
        else {
            res.status(403).send({
              message: 'Your action is unauthorized'
            })
        }
    });

    return res;
}

const unsubscribe = async (req, res) => {
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

const remark = async (req, res) => {
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

const update = async (req, res) => {
    const { username, email, age, religion, interests, remarks } = req.body;
    const {token_username, isAdmin} = req.decoded;
    //find the specified user
    User.findOne({username: username}, (err, user) => {
        if (user === null) {
            res.status(400).send({
                success: false,
                message: 'User not found.'
            });
        }//User can update his/her own account
        //Only admin can update everyone else account
        else if(isAdmin || token_username === username){
            user.updateOne({username: username}, {email: email, religion: religion, age: age, interests: interests, remarks: remarks});
            user.save()
            .then(() => res.status(200).json({success: true, message: `You have successfully updated the detail of ${username}.`}))
            .catch((err) => res.status(400).json({success: false, message: `You have failed to update the detail of ${username}.`}))
        }
        else {
            res.status(403).send({
              message: 'Your action is unauthorized'
            })
        }
    });

    return res;
}

const changePassword = async (req, res) => {
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

module.exports = { index, createUser, deleteUser, findOneUser, login, subscribe, unsubscribe, remark, update, changePassword }