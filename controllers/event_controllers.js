const Event = require('../models/event');

//create an event
const createEvent = (req, res) => {
    const {event_name, description, event_date_and_presenters, fee, is_family_friendly, minimum_age, maximum_capacity, event_category, images} = req.body;

    const newEvent = new Event({event_name, description, event_date_and_presenters, fee, is_family_friendly, minimum_age, maximum_capacity, event_category, images});
    newEvent.save()
    .then(()=>res.status(201).json(`A new event has been created!`))//return the result
    .catch(err=> res.status(400).json('Error: ' + err));

}

module.exports = { createEvent }