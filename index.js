const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();


const PORT = process.env.PORT || 8888;

const app = express();

//Mongoose

const dbConfig = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(process.env.DB_URL, dbConfig, (err) => {
    if (err)
        console.error("Error ❌");
    else
        console.log("Connected to db ✅");

});

app.use(express.json());
app.use(cors());

//Connecting the routes
app.use(require('./routes/index'));

app.listen(PORT,
    () => console.log(`Listening on port ${PORT}`)
);