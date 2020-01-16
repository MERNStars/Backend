const Presenter = require('../models/presenter');


const index = (req, res) => {
    const {isAdmin} = req.decoded;

    if(!isAdmin){
        res.status(403).send({
            message: 'Your action is unauthorized'
          });
    }
    else{
        //retrieve all records of the presenters
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
    }

    return res;
}

const createPresenter = (req, res) => {
  const { first_name, last_name, title, qualification, short_description, long_description, avatar } = req.body;
    //create a new presenter
    const newPresenter = new Presenter({
        first_name, last_name, title, qualification, short_description, long_description, avatar
    });
    //save the document
    newPresenter.save()
    .then(()=>res.status(201).json(`Presenter ${first_name} ${last_name} has been added!`))//return the result
    .catch(err=> res.status(400).json('Error: ' + err));
}

const updatePresenter = (req, res) => {
    const { _id, first_name, last_name, title, qualification, short_description, long_description, avatar } = req.body;
    Presenter.findByIdAndUpdate(_id, {first_name, last_name, title, qualification, short_description, long_description, avatar}, {useFindAndModify: false})
    .then(() => res.status(200).json({success: true, message: `Presenter ${_id} has been updated.`}))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports = { index, createPresenter, updatePresenter};