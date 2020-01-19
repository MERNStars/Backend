const Event = require('../models/event');

//create an event
const createEvent = (req, res) => {
    const {event_name, description, event_date_and_presenters, fee, is_family_friendly, minimum_age, maximum_capacity, event_category, images} = req.body;

    const newEvent = new Event({event_name, description, event_date_and_presenters, fee, is_family_friendly, minimum_age, maximum_capacity, event_category, images});
    newEvent.save()
    .then(()=>res.status(201).json(`A new event has been created!`))//return the result
    .catch(err=> res.status(400).json('Error: ' + err));

}

const index = (req, res) => {
    Event.find({}, (err, result) =>{
        if(err){
            res.status(400).json(err);
        }
        else{
            res.status(200).json(result);
        }
    });
    return res;
}

const update = async (req, res) => {
    const {_id, event_name, description, event_date_and_presenters, fee, is_family_friendly, minimum_age, maximum_capacity, event_category, images} = req.body;

    const {isAdmin} = req.decoded;

    if(!isAdmin){
        return res.status(400).json({success: false, message: "You don't have the administrative rights to carryout this update."});
    }

    res = await Event.updateOne({_id: _id}, {event_name, description, event_date_and_presenters, fee, is_family_friendly, minimum_age, maximum_capacity, event_category, images}, 
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

module.exports = { createEvent, index, update }