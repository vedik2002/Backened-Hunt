const mongoose = require("mongoose")

const ques = new mongoose.Schema({
    question:{
      type: String,
      required: true
    },
  
    code:{
      type : String,
      required: true,
    },
  
    score:{
      type: Number,
      required: true,
    },
  
});

const Model = mongoose.model("Model",ques)



module.exports = Model;