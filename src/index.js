const express = require('express');
const app = express();
require('./db/connect');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./api/api'));

app.use((err, req, res, next) => {
    console.error(`Error occurred: ${err.message}`);
    res.status(500).send({
        status: "error",
        message: "Something went wrong!"
    });
});

app.use((req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode >= 400) {
            console.error(`Issue with request: ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
});

app.listen(3551, () => {
    console.log("Express Server Started on port 3551");
});
