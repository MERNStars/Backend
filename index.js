const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();


const PORT = process.env.PORT || 8888;

const app = express();

//Mongoose

const dbConfig = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false };

mongoose.connect(process.env.DB_URL, dbConfig, (err) => {
    if (err)
        console.error("Error ❌");
    else
        console.log("Connected to db ✅");

});

app.use(express.json());
// NEW - Add CORS headers - see https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
app.use(cors());

//Connecting the routes
app.use(require('./routes/index'));

app.listen(PORT,
    () => console.log(`Listening on port ${PORT}`)
);