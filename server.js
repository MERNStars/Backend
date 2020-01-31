const app = require("./index");
const PORT = process.env.PORT || 8888;

const server = app.listen(PORT,
    () => console.log(`Listening on port ${PORT}`)
);

module.exports = server;