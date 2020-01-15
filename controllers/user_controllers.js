const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const index = async (req, res) => {
  const query = await User.find({});
  query instanceof mongoose.Query;
  const docs = await query;
  res.send(docs);

  return res;
}

const createUser = async(req, res) => {
  const { username, password, isAdmin, email, age, religion, interests, remarks } = req.body;

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

    newUser.setPassword(password);

    newUser.save()
    .then(()=>res.json('User added!'))
    .catch(err=> res.status(400).json('Error: ' + err));
}

const deleteUser = async (req, res)=> {
  User.findOneAndDelete({username: req.params.username})
  .then(()=> res.json('User deleted.'))
  .catch(err => res.status(400).json('Error: ' + err));
};

const findOneUser = async (req, res)=> {
//   console.log("User id: ", req.params.username);
  User.findOne({username: req.params.username})
  .then(user => res.json(user))
  .catch(err => res.status(400).json('Error: ' + err));
};

const login = async (req, res) => {
  const {username, password} = await req.body;
  User.findOne({username : username }, function(err, user) {
    if (user === null) {
      res.status(400).send({
        message: 'User not found.'
      });
    }
    else {
      if (user.validPassword(password)) {
        let token = jwt.sign({username: username, isAdmin: true},
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
    User.updateOne({username: req.params.username}, {newsletter: true})
    .then(result => {
        console.log("Subscribe: " + result);
        res.status(200).json(result);
    })
    .catch(err => res.status(400).json("Error: " + err));
}

const unsubscribe = async (req, res) => {
    User.updateOne({username: req.params.username}, {newsletter: false})
    .then(result => {
        console.log("Subscribe: " + result);
        res.status(200).json(result);
    })
    .catch(err => res.status(400).json("Error: " + err));
}

module.exports = { index, createUser, deleteUser, findOneUser, login, subscribe, unsubscribe }