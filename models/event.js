const mongoose = require("mongoose");

const Schema = mongoose.Schema;

require('dotenv').config();

const eventSchema = new Schema({
  event_name: {
    type: String,
    required: true
  },
  //to be used when there isn't much space for all the text
  short_description: {
      type: String,
      required: false
  },
  long_description:{
      type: String,
      required: true
  },
  event_date_time:{
      //I'm setting this to an array, in case we want to allow recurring event
      //e.g. ["12/Feb/2020 5:30PM", "18/Feb/2020 5:30PM"]
      type: [Date],
      required: true
  },
  fee:{//eg. infant(2 and below): free, child (3-12): $5, full fee: 50
      type: [{ type: String, cost: Number}],
      default: 0
  },
  isFamilyFriendly: {
    type: Boolean,
    default: false
  },
  event_category:{
      type: String,
      enum: [ "bible seminar", "career seminar", "exercise class", "health seminar", "healthy cooking class", "mental health workshop", "massage service", "others", "quit smoking/other addiction", "weight-loss program"],
      default: "health talk"
  }
  ,
  images:{
      //In case we want to allow multiple photos to be uploaded
    type: [String],
    default: ['my_event.jpg']
  },
  attendees:{ 
      //e.g. [{someuserid, bring_friends: 2, dependents: [{"Jake", 5}, {"Abbie": 8}]}, {someuserid2, bring_friends: 0, dependents: []}]
      type: [{user_id: String, bring_friends: Number, dependents:[{name: String, age: Number}]}]
  },
  presenters:{
      //an array of presenter's id
      type: [String]
  }
},{
  collection: 'events'
});

const WeExploreEvent = mongoose.model("Event", eventSchema);

module.exports = WeExploreEvent;