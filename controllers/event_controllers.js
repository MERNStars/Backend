const Event = require('../models/event');

//create an event
const createEvent = (req, res) => {
    const {event_name, description, event_date_and_presenters, registration_closed_date, fee, is_family_friendly, minimum_age, event_category, images, event_capacity, published, status} = req.body;

    const {isAdmin} = req.decoded;
    //if the user is not an admin, he has no business here.
    if(!isAdmin){
        return res.status(401).json({success: false, message: "You don't have the administrative rights to carryout this update."});
    }

    const newEvent = new Event({event_name, description, event_date_and_presenters, registration_closed_date, fee, is_family_friendly, minimum_age, event_capacity, event_category, images, published, status});
    newEvent.save()
    .then(()=>res.status(201).json(`A new event has been created!`))//return the result
    .catch(err=> res.status(500).json('Error: ' + err));

}

const index = (req, res) => {
    Event.find({}, (err, result) =>{
        if(err){
            res.status(500).json(err);
        }
        else{
            res.status(200).json(result);
        }
    });
    return res;
}

const update = async (req, res) => {
    const {_id, event_name, description, event_date_and_presenters, registration_closed_date, fee, is_family_friendly, minimum_age, event_capacity, event_category, images, published, status, attendee_count} = req.body;

    const {isAdmin} = req.decoded;
    //if the user is not an admin, he has no business here.
    if(!isAdmin){
        return res.status(401).json({success: false, message: "You don't have the administrative rights to carryout this update."});
    }

    res = await Event.updateOne({_id: _id}, {event_name, description, event_date_and_presenters, registration_closed_date, fee, is_family_friendly, minimum_age, event_category, images, published, status, event_capacity, attendee_count}, 
        (err, result) =>{
        if(err){
            res.status(500).json(err)
        }
        
        if(result.n > 0)
            res.status(204).json(result);
        else
            res.status(400).json(result);
    })
    .catch(err => res.status(400).json(err));
    return res;
}

const deleteEvent = async (req, res) => {
    const {_id} = req.body;

    const {isAdmin} = req.decoded;
    //if the user is not an admin, he has no business here.
    if(!isAdmin){
        return res.status(500).json({success: false, message: "You don't have the administrative rights to carryout this update."});
    }

    res = await Event.findByIdAndDelete(_id, 
        (err, result) =>{
        if(err){
            res.status(400).json(err)
        }
        console.log(result);
        
        // if(result.n > 0)
            res.status(200).json(result);
        // else
        //     res.status(400).json(result);
    })
    .catch(err => res.status(400).json(err));
    return res;
}

const findEventByKeywords = (req, res) => {
    const {keywords} = req.params;
    
    //break up the keywords and form a series of conditions for the queiry
    const byEventName = keywords.split(' ').map(keyword => { 
        return JSON.parse(`{"event_name": { "$regex": "${keyword}", "$options": "i" }}`);
    });
    const byCategory = keywords.split(' ').map(keyword => { 
        return JSON.parse(`{"event_category": { "$regex": "${keyword}", "$options": "i" }}`);
    });
    let byDescription = (keywords.split(' ').map(keyword => { 
        return JSON.parse(`{"description": { "$regex": "${keyword}", "$options": "i" }}`);
    }));
    
    const conditions = [...byEventName, ...byCategory, ...byDescription]

    console.log(conditions);

    Event.find( { $or: conditions })
    .then((events)=> res.status(200).json(events))
    .catch(err => res.status(400).json({success: false, message: `An error has occured.`}));
}

const findEventById = (req, res) => {
    const {id} = req.params;

    Event.findById(id, (err, result) => {
        if(err){
            res.status(400).json(err)
        }
        res.status(200).json(result);
    });
    return res;
}

module.exports = { createEvent, index, update, deleteEvent, findEventByKeywords, findEventById }