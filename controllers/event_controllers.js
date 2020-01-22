const Event = require('../models/event');
const Presenter = require('../models/presenter');

//create an event
const createEvent = (req, res) => {
    const {event_name, description, event_date, presenters, registration_closed_date, fee, is_family_friendly, minimum_age, event_category, images, event_capacity, published, status} = req.body;

    const {isAdmin} = req.decoded;
    //if the user is not an admin, he has no business here.
    if(!isAdmin){
        return res.status(401).json({success: false, message: "You don't have the administrative rights to carryout this update."});
    }

    const newEvent = new Event({event_name, description, event_date, presenters,registration_closed_date, fee, is_family_friendly, minimum_age, event_capacity, event_category, images, published, status});
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
    const {_id, event_name, description, event_date, presenters,registration_closed_date, fee, is_family_friendly, minimum_age, event_capacity, event_category, images, published, status, attendee_count} = req.body;

    const {isAdmin} = req.decoded;
    //if the user is not an admin, he has no business here.
    if(!isAdmin){
        return res.status(401).json({success: false, message: "You don't have the administrative rights to carryout this update."});
    }

    res = await Event.updateOne({_id: _id}, {event_name, description, event_date, presenters, registration_closed_date, fee, is_family_friendly, minimum_age, event_category, images, published, status, event_capacity, attendee_count}, 
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

const deleteEvent = (req, res) => {
    const {_id} = req.body;

    const {isAdmin} = req.decoded;
    //if the user is not an admin, he has no business here.
    if(!isAdmin){
        return res.status(500).json({success: false, message: "You don't have the administrative rights to carryout this update."});
    }

    Event.findByIdAndDelete(_id, 
        (err, result) =>{
        if(err){
            res.status(400).json(err)
        }
        // console.log(result);
        
        // if(result.n > 0)
        else{
            console.log("Event deleted.")
            res.status(200).json(result);
        }
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

const findEventCategory = (req, res) => {
    const {keywords} = req.params;
    
    //break up the keywords and form a series of conditions for the queiry
    Event.find( {"event_category": { "$regex": keywords, "$options": "i" } })
    .then((events)=> res.status(200).json(events))
    .catch(err => res.status(400).json({success: false, message: `An error has occured.`}));
}

const findEventById = (req, res) => {
    const {id} = req.params;
    // const events = null;
    Event.findById(id).lean()
    .then(event => {
        // console.log(event);
        if (!event) throw new Error('Event not found')
        return event;
    })
    .then(event=>{
        Presenter.find({ _id: { $in: event.presenters}}).lean()
        .then(presenters=>{
            // console.log(presenters);
            const event_detail = {...event}
            if(presenters)
                event_detail.presenter_detail = presenters;
            // console.log(event_detail);
            res.send(event_detail);
        })
    })
    .catch(err => {
        console.log('error', err);
        res.status(400).send(err);
    });
    return res;
}

const attendEvent = async (req, res) => {
    const {_id, username, friends, dependents} = req.body;
    const new_attendee = {username, friends, dependents};

    const filter = { "_id": _id};

    Event.findOne({ _id: _id}, (err, event) => {
        console.log("Event found: " + event);
        if(err || event == null || event == undefined){
            return res.status(500).json({success: false, message: "Can't find the event."});
        }
        const existing_attendees = [...event.attendees];
        const foundData = existing_attendees.find(attendee =>{
            return attendee.username === username;
        });
        console.log("Attendee search outcome: " + foundData);
        if(!foundData){
            const num_attendee = event.attendee_count + friends.length + dependents.length + 1;

            existing_attendees.push(new_attendee);//update the attendees array
            Event.updateOne(filter, {attendees: existing_attendees, attendee_count: num_attendee}, 
                (err, result) =>{
                if(err){
                    res.status(500).json(err)
                }
                console.log("Update result: " + result);
                if(result.n > 0)
                    res.status(200).json({success: true, message: "Successfully added an attendee."});
                else
                    res.status(400).json({success: false, message: "Failed to add attendee."});
            });
        }
        else{
            res.status(400).json({success: false, message: "Ahhh!  You have already signed up to attend the event."});
        }
        return event;
    })
    .catch(err => res.status(400).json({success: false, message: "Ooops!  Something went terribly wrong."}));
    
    return res;
}

const unattendEvent = async (req, res) => {
    const {_id, username} = req.body;

    const filter = { "_id": _id};

    Event.findOne({ _id: _id}, (err, event) => {
        console.log("Event found: " + event);
        if(err || event == null || event == undefined){
            return res.status(500).json({success: false, message: "Can't find the event."});
        }
        const existing_attendees = [...event.attendees];
        const foundAt = existing_attendees.findIndex(attendee =>{
            return attendee.username === username;
        });
        console.log("Attendee search outcome: " + foundAt);
        if(foundAt >= 0){
            const num_attendee = event.attendee_count - event.attendees[foundAt].friends.length - event.attendees[foundAt].dependents.length - 1;

            existing_attendees.splice(foundAt, 1);//update the attendees array
            Event.updateOne(filter, {attendees: existing_attendees, attendee_count: num_attendee}, 
                (err, result) =>{
                if(err){
                    res.status(500).json({success: false, message: "Something is not right."})
                }
                console.log("Update result: " + result);
                if(result.n > 0)
                    res.status(200).json({success: true, message: "Successfully removed an attendee."});
                else
                    res.status(400).json({success: false, message: "Failed to remove attendee."});
            });
        }
        else{
            res.status(400).json({success: false, message: "Ayyy!  You have not signed up to attend the event."});
        }
        return event;
    })
    .catch(err => res.status(400).json({success: false, message: "Ooops!  Something went terribly wrong."}));
    
    return res;
}

module.exports = { createEvent, index, update, deleteEvent, findEventByKeywords, findEventById, findEventCategory, attendEvent, unattendEvent }