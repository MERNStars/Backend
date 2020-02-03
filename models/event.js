const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('dotenv').config();

const feeSchema = new Schema(
  { type: String, cost: Number}
);

const dependentSchema = new Schema({name: String, age: Number});
const attendeeSchema = new Schema({username: String, friends: [String], dependents:[dependentSchema], attended: { type: Boolean, default: false }});

const eventSchema = new Schema({
  event_name: {
    type: String,
    required: true
  },
  description:{
      type: String,
      required: true
  },
  event_date:{
      //I'm setting this to an array, in case we want to allow recurring event
      //e.g. [{begin: "12/Feb/2020 5:30PM", end: "12/Feb/2020 8:30PM", presenters: ["presenter_id1", "presenter_id2"]}]
      type: {begin: Date, end: Date},
      required: true
      //take the presenter out
    
  },
  registration_closed_date: {
    type: Date,
    required: true
  },

  presenters: [{ type: mongoose.Types.ObjectId, ref: "Presenter"}],
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
  event_category:{
      type: String,
      enum: ["bible seminar", "career seminar", "exercise class", "health seminar", "healthy cooking", "lifestyle change workshop", "mental health workshop", "massage service", "others", "addiction recovery", "weight-loss program"],
      default: "health talk"
  },
  //if true, it will be visible on the website
  //if false it will not be shown
  published:{
    type: Boolean,
    default: false
  },
  //indicating the status of the event, 
//   Scheduled - The event's Date Start is in the future. When events are generated, or when you manually enter an event, by default, its status is set to Scheduled.
// Canceled - The event has been cancelled.
// In Progress - The event has begun, but is not yet completed.
// On-Hold - The event has been placed on hold before it began.
// Stopped - The event began but was stopped before completion.
// Completed - The event has completed.
// Registration Closed - The event has been closed.
  status: {
    type: String,
    enum: ["scheduled", "canceled", "postponed", "completed", "sold out"],
    default: "scheduled"
  },
  images:{
      //In case we want to allow multiple photos to be uploaded
    type: [String],
    default: ['my_event.jpg']
  },
  event_capacity: {
    type: Number,
    default: 50
  },
  attendee_count: {
    type: Number,
    default: 0
  },
  attendees:{ 
      //e.g. [{someuserid, friends: ["Jack", "Eddie", "Lisa"], dependents: [{"Jake", 5}, {"Abbie": 8}]}]
      type: [attendeeSchema]
  }
},{
  collection: 'events'
});

const WeExploreEvent = mongoose.model("Event", eventSchema);

module.exports = WeExploreEvent;