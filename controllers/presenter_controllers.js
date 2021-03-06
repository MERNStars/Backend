const Presenter = require('../models/presenter');


const index = (req, res) => {
        Presenter.find({}, (err, presenter) => {
        if(err){
            res.status(400).send({
                success: false,
                message: 'Ooops!  Something went terribly wrong.'});
        }
        if (presenter === null) {
            res.status(400).send({
                success: false,
                message: 'There is nothing in the database'
            });
        }
        //Only Admin is allowed to have full access to user's detail
        else{
            res.status(200).json(presenter);
        }
        });
    // }

    return res;
}

const createPresenter = (req, res) => {
  const { first_name, last_name, title, type, qualification, short_description, long_description, avatar, contact_info } = req.body;
    //create a new presenter
    const newPresenter = new Presenter({
        first_name, last_name, title, type, qualification, short_description, long_description, avatar, contact_info
    });
    //save the document
    newPresenter.save()
    .then(()=>res.status(201).json({ success: true, message: `Presenter ${first_name} ${last_name} has been added!`, _id: newPresenter._id }))//return the result
    .catch(err=> res.status(400).json('Error: ' + err));
}

const updatePresenter = (req, res) => {
    const { _id, first_name, last_name, title, type, qualification, short_description, long_description, avatar, contact_info } = req.body;
    Presenter.findByIdAndUpdate(_id, {first_name, last_name, title, type, qualification, short_description, long_description, avatar, contact_info}, {useFindAndModify: false})
    .then(() => res.status(200).json({success: true, message: `Presenter ${_id} has been updated.`}))
    .catch(err => res.status(400).json('Error: ' + err));
}

const deletePresenter = (req, res) => {
    const {_id} = req.body;
    Presenter.findByIdAndDelete(_id)
    .then(()=> res.status(200).json({success: true, message: `Presenter ${_id} has been deleted.`}))
    .catch(err => res.status(400).json({success: false, message: `An error has occured and presenter ${_id} has NOT been deleted.`}))
}

const findPresenterByName = (req, res) => {
    const {query} = req.params;

    Presenter.find( { $or: [{ "first_name": { "$regex": query, "$options": "i" }}, {"last_name": { "$regex": query, "$options": "i" }}] })
    .then((presenters)=> res.status(200).json(presenters))
    .catch(err => res.status(400).json({success: false, message: `An error has occured and presenter ${_id} has NOT been deleted.`}));
}

const findPresenterById = (req, res) => {
    const {id} = req.params;

    Presenter.findOne({ "_id": id})
    .then((presenters)=> res.status(200).json(presenters))
    .catch(err => res.status(400).json({success: false, message: `An error has occured and presenter ${_id} has NOT been deleted.`}));
}

const findManyPresenters = (req, res) => {
    const {query} = req.params;
    // console.log(query);
    ids = query.split(',');
    Presenter.find({ _id: { $in: ids}})
    .then((presenters)=> res.status(200).json(presenters))
    .catch(err => res.status(400).json({success: false, message: `An error has occured.`}));
}

module.exports = { index, createPresenter, updatePresenter, deletePresenter, findPresenterByName, findPresenterById, findManyPresenters};