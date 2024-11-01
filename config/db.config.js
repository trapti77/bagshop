const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose"); //namespace
const config = require("config");
mongoose
  .connect(`${config.get("MONGODB_URI")}/bagshop`)
  .then(function () {
    dbgr("connected");
  })
  .catch(function (err) {
    dbgr(err);
  });

module.exports = mongoose.connection;
