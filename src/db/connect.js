const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Asteria', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});