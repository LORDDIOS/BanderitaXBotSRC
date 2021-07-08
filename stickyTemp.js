models/stickyTemp

const mongoose = require("mongoose");

const reqString = {

  
  required: true

};

const StickyTempSchema = new mongoose.Schema({

  lastStickyID: reqString,

  ChannelID: reqString,

  GuildID: reqString

});

const MessageModel = (module.exports = mongoose.model(

  "StickyTemp",

  StickyTempSchema

));

