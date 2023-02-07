const mongoose = require("mongoose");
const Model = require("./db/question");
const MyModel = require("./db/account");
const QRcode = require('qrcode');
const crypto = require('crypto');
const fs = require('fs');

mongoose.connect("mongodb://localhost:27017/testrun", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

function generateCode() {
    return crypto.randomBytes(4).readUInt32BE(0);
  }
  
  async function createquesion(){
    for(let i=0;i<50;i++)
    {
      const que = new Model({
        question : "abcd" + i,
        score: 0,
        code : generateCode(),
      })
      await que.save();
    }
  }
  
  
  async function createaccount(){
    for(let i=0;i<50;i++)
    {
      const team = MyModel({
        name: "Team" + i,
        arr : []
      })
  
      await team.save();
    }
  }
  
  async function assigncode()
  {
    let questions = await Model.find()
    let accounts = await MyModel.find()
  
    let index = 0;
  
    for (let i = 0; i < accounts.length; i++) {
      for (let j = 0; j < 10; j++) {
        if(questions[index]) {
          accounts[i].arr.push(questions[index].code);
          if(index!=questions.length-1)
          {
            index++;
          }
          else
          {
            index = 0;
          }
        }
      }
  
      await accounts[i].save();
    }
  }

  async function qrcode()
  {
    Model.find({},(err, docs) =>{
        if (err) return console.error(err);
      
        docs.forEach(result => {
          QRcode.toDataURL(result.code)
            .then(res => {
              fs.writeFileSync(`C:\\VIT\\Hunt\\images\\${result._id}.png`, res, 'binary');
              console.log(`QR code for code: ${result.code} generated and stored in images directory`);
            })
            .catch(err => console.error(err));
        });
    });
  }
  async function main() {
  
    //await createquesion();
    //await createaccount();
    //await assigncode();
    //await qrcode();
    let accounts = await MyModel.find();
    
    console.log(accounts);
  }
  
main();


