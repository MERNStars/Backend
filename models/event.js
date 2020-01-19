const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('dotenv').config();

const feeSchema = new Schema(
  { type: String, cost: Number}
);

const dependentSchema = new Schema({name: String, age: Number});
const atteneeSchema = new Schema({username: String, friends: [String], dependents:[dependentSchema]});

const eventSchema = new Schema({
  event_name: {
    type: String,
    required: true
  },
  description:{
      type: String,
      required: true
  },
  event_date_and_presenters:{
      //I'm setting this to an array, in case we want to allow recurring event
      //e.g. [{begin: "12/Feb/2020 5:30PM", end: "12/Feb/2020 8:30PM", presenters: ["presenter_id1", "presenter_id2"]}]
      type: {begin: Date, end: Date, presenter_ids: [mongoose.Types.ObjectId]},
      required: true
  },
  fee:{//eg. infant(2 and below): free, child (3-12): $5, full fee: $50
      type: [feeSchema],
      default: [{"type": "free", "cost": 0}]
  },
  is_family_friendly: {
    type: Boolean,
    default: false
  },
  minimum_age: { //age restriction
    type: Number,
    default: 18
  },
  maximum_capacity: {
    type: Number,
    default: 50
  },
  event_category:{
      type: String,
      enum: ["bible seminar", "career seminar", "exercise class", "health seminar", "healthy cooking class", "lifestyle change workshop", "mental health workshop", "massage service", "others", "quit smoking/other addiction", "weight-loss program"],
      default: "health talk"
  },
  images:{
      //In case we want to allow multiple photos to be uploaded
    type: [String],
    default: ['my_event.jpg']
  },
  attendees:{ 
      //e.g. [{someuserid, friends: ["Jack", "Eddie", "Lisa"], dependents: [{"Jake", 5}, {"Abbie": 8}]}]
      type: [atteneeSchema]
  }
},{
  collection: 'events'
});

const WeExploreEvent = mongoose.model("Event", eventSchema);

module.exports = WeExploreEvent;