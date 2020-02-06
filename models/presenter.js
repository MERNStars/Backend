const mongoose = require("mongoose");

const Schema = mongoose.Schema;


require('dotenv').config();

const presenterSchema = new Schema({
  first_name: 
  {
    type: String,
    required: true,
    minlength: 2
  },
  last_name: 
  {
    type: String,
    required: true,
    minlength: 2
  },
  title:{
    type: String,
    required: true,
    minlength: 2
  },
  type:{
    type: String,
    default: "presenter",
    enum: ["instructor", "organiser", "presenter"]
  },
  qualification:{
    type: String,
    required: true
  },
  short_description: {
      type: String,
      required: false
  },
  long_description:{
      type: String,
      required: true
  },
  //Todo: modify the controller
  contact_info:{
    type: String,
    required: false
  },
  avatar:{
    type: String,
    default: 'my_avatar.jpg'
  }
},{
  collection: 'presenters'
});

const Presenter = mongoose.model("Presenter", presenterSchema);

module.exports = Presenter;