'use strict';

const mongoose = require('mongoose');


var donorSchema = new mongoose.Schema({
   donorid : {
       type: Number
   },
   password : {
       type: String
   },
   donorname : {
       type: String
   },
   gender : {
    type: String
   },
   email : {
    type: String
   },
   gender : {
    type: String
   },
   mobile : {
       type: String
   },
   dob : {
       type: Date
   },
   bloodgroup : {
       type: String
   }
},{timestamps: true});

//mongoose.Promise = global.Promise;
module.exports = mongoose.model('donorregister', donorSchema);