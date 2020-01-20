const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto');
require('dotenv').config();

const userSchema = new Schema({
  username: 
  {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    },
    unique: true
  },
  password:
  {
    type: String,
    minlength: 8,
    required: true
  },
  first_name:{
    type: String,
    required: true,
    minlength: 2  //Some Asian names are just 2 characters... Li Qi
  },
  last_name:{
    type: String,
    required: true,
    minlength: 2 //Jack Ma
  },
  sex: {
    type: String,
    enum: ["male", "female", "others", "unspecified"],
    default: "unspecified"
  },
  isAdmin: 
  {
    type: Boolean,
    default: false
  },
  newsletter:{
    type: Boolean,
    default: true
  },
  age:{
    type: Number,
    min: 18,
    required: true
  },
  religion:
  {
    type: String,
    enum: ['agnostic', 'anglican', 'assyrian apostolic', 'atheist', 'australian aboriginal traditonal religions', 'baptist', 'buddhism', 'catholic', 'eastern orthodox', 'hinduism', 'islam', 'jehovah witness', 'judaism', 'later-day saints', 'lutheran', 'other religion', 'other christian', 'preferred not to indicate', 'presbyterian', 'salvation army', 'secular beliefs', 'seventh-day adventist', 'torres strait islander spirituality', 'uniting church', 'unspecified'],
    default: 'unspecified'
  },
  interests:{
    type: [String]
  },
  remarks:{
    type: String,
    default: ""
  }
},{
  collection: 'users'
});

userSchema.methods.setPassword = function(password) {
  this.password = crypto.pbkdf2Sync(password, process.env.PASS_SALT, 1000, 64, `sha512`).toString(`hex`);
}

userSchema.methods.validPassword = function(password) {
  const _password = crypto.pbkdf2Sync(password, process.env.PASS_SALT, 1000, 64, `sha512`).toString(`hex`);
  return this.password === _password;
}

const User = mongoose.model("User", userSchema);

module.exports = User;