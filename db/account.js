const mongoose = require("mongoose")


const account = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    point: {
      type: Number,
      required: true,
      default: 0
    },
    count:{
      type: Number,
      required: true,
      default: 3 
    },
    arr:[{type:String}]
});

const MyModel = mongoose.model("MyModel",account)

module.exports = MyModel;