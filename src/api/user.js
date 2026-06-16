const SCHEMA = require("../db/schema");

module.exports = {
    getUser: async (username) => {
        return await SCHEMA.User.findOne({ username });
    }
};