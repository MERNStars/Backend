const mongoose = require('mongoose');

const dbConfig = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false };

mongoose.connect(process.env.DB_URL, dbConfig, (err) => {
    if (err)
        console.error("Error ❌");
    else
        console.log("Connected to db ✅");

});

