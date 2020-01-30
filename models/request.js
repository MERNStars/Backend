const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('dotenv').config();

const requestSchema = new Schema({
    username:{
        type: String,
        required: true,
        validate: {
        validator: function(v) {
            return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
        }
    },
    uuid_key: {
        type: String,
        required: true,
        length: 35,
        unique: true
    },
    expiry_date: {
        type: Date,
        required: true
    }
},{
  collection: 'requests'
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;