const mongoose = require('mongoose');
require('dotenv').config();

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(process.env.TEST_MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true });
} else {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}
module.exports = mongoose;
