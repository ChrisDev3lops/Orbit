const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('./structs/logger');
const errors = require('./structs/errors');
const { v4: uuidv4 } = require('uuid');
const { ApiException } = errors;
const config = require('../config.json');

const app = express();
require('./db/connect');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("etag", false);

app.use(require('./api/api'));

app.use((req, res, next) => {
    next(new ApiException(errors.com.epicgames.common.not_found));
});

app.use((err, req, res, next) => {
    let error = null;

    if (err instanceof ApiException) {
        error = err;
    } else {
        const trackingId = req.headers["x-epic-correlation-id"] || uuidv4();
        error = new ApiException(errors.com.epicgames.common.server_error).with(trackingId);
        console.error(trackingId, err);
    }

    error.apply(res);
});

app.listen(config.server.port, () => {
    logger.Log(`Asteria Backend is up and listening on port ${config.server.port}!`);
});
