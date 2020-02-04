const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/e-technology", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
mongoose.Promise = global.Promise;

module.exports = mongoose;
