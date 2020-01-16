const Presenter = require('../models/presenter');


// const index = (req, res) => {
//     const {token_username, isAdmin} = req.decoded;
//     console.log("Getting all users...!");
//     User.find({}, (err, users) => {
//       if(err){
//           res.status(400).send({
//             success: false,
//             message: 'Ooops!  Something went terribly wrong.'});
//       }
//       if (users === null) {
//           res.status(400).send({
//               success: false,
//               message: 'There is nothing in the database'
//           });
//       }
//       //Only Admin is allowed to have full access to user's detail
//       else if(isAdmin || token_username === username){
//           res.status(200).json(users);
//       }
//       else {
//           res.status(403).send({
//             message: 'Your action is unauthorized'
//           })
//       }
//     });

//     return res;
// }

const createPresenter = (req, res) => {
  const { first_name, last_name, title, qualification, short_description, long_description, avatar } = req.body;
    //create a new user
    const newPresenter = new Presenter({
        first_name, last_name, title, qualification, short_description, long_description, avatar
    });
    //save the document
    newPresenter.save()
    .then(()=>res.status(201).json(`Presenter ${first_name} ${last_name} has been added!`))//return the result
    .catch(err=> res.status(400).json('Error: ' + err));
}

module.exports = { createPresenter}