
///////////dependecies///////////////
const mongoose = require("mongoose");
const Model = require("./db/question");
const MyModel = require("./db/account");
const express = require("express");
const session = require('express-session')
//////////////////////////////////////

// connect to the MongoDB database //////////////////
/*mongoose.connect("mongodb://localhost:27017/testrun", {
   useNewUrlParser: true,
   useUnifiedTopology: true,
  
});*/

const connectDB = async () => {
    const conn = await mongoose.connect("mongodb://localhost:27017/testrun",
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
    console.log(`MongoDB Connected`);
};
///////////////////////////////////////////////////////


const app = express();

app.set('view engine', 'ejs');

app.use(express.static('views'));
app.use(express.json())

app.use(session({
  secret: 'abcdef',
  resave: false,
  saveUninitialized: true
}));


app.get('/', (req, res) => {
  try {
    res.send("Login page");
  } catch (error) {
    console.error('Error rendering login page:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/', async(req, res) => {
  try {
    const {name}  = req.body;
    console.log(name)
    const user = await MyModel.findOne({name:name});
    
    if (!user) {
      return res.status(401).send('Incorrect name');
    }

    req.session.username = user.name;

    res.redirect('/dashboard')
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/dashboard', async(req, res) => {
  try {
    if (!req.session.username) {
      return res.redirect('/');
    }

    const {name} = req.session.username;
    const user = await MyModel.findOne({ name: name});

    let question1,question2,question3;

    let count = 0;
    
    for(let i=0;i<3;i++)
    {
      if(count!==user.arr.length)
      {
        if(user.arr[i]!==null)
        {
          const temp = user.arr[i];
          const ques = await Model.findOne({temp});


          if(i === 0)
          {
            question1 = ques.question;
          }else if(i === 1){
            question2 = ques.question;
          }else if(i === 2){
            question3 = ques.question;
          }

          count = count+1;
        }
        else
        {
          count = count+1;
        }
      }
      else
      {
        res.redirect();
      } 
    }

    const allData = await MyModel.find().sort({point: -1}).select('name point');

    data = {question1,question2,question3,allData};

    
    if (question1 !== undefined && question2 !== undefined && question3 !== undefined) {
      res.send({ data: data});
    }
    else
    {
      res.render('') // the game is finished page
    }

  }
   catch(error){
    console.error('Error rendering dashboard page:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/dashboard',(req,res)=>{
  try{
    res.redirect('/dashboard/code');
  }
  catch{
    console.error('Error redirecing the page', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/dashboard/code',(req,res)=>{
  try{
    res.send("code page")
    //res.render('') //code input page
  }
  catch
  {
    console.error('Error rendering code page:', error);
    res.status(500).send('Internal Server Error');
  }
})



app.get('/dashboard/codes/success',(req,res)=>{
  try{
    res.render('') // show the success page
  }
  catch
  {
    console.error('Error rendering success page:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/dashboard/codes/error',(req,res)=>{
  try{
    res.render('') // show the success page
  }
  catch
  {
    console.error('Error rendering error page:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.post('/dashboard/codes/success',(req,res)=>{
  try{
    res.redirect('/dashboard')
  }
  catch
  {
    console.error('Error redirecting the page:', error);
    res.status(500).send('Internal Server Error');
  }
})



app.post('/dashboard/codes/error',(req,res)=>{
  try{
    res.redirect('/dashboard')
  }
  catch
  {
    console.error('Error redirecting the page:', error);
    res.status(500).send('Internal Server Error');
  }
})


//updating the server
app.post('/dashboard/codes', async (req, res) => {

  const teamname = req.session.username;
  const search = req.body.search;
  console.log(teamname)
  try {
    const user = await Model.find({code: search});  
    if (!user) return res.send(" Question not found");
    const temp = user.score;
    const updatedUser = await MyModel.findOne({name: teamname});
    console.log(updatedUser)
    console.log(updatedUser.arr)
    if (!updatedUser) throw new Error('User not found');
    for(var i=0;i<updatedUser.arr.length;i++) {
      if (updatedUser.arr[i] === search) {
        // Update all both together 
        await updatedUser.updateOne({$inc :{point: point + temp}});
        await updatedUser.updateOne({$inc :{count: 1}});
        updatedUser.arr.splice(i, 1, null);
        res.send("The socre is updated")
        //return res.rendirect('/dashboard/codes/success'); //page showing points have been updated
      }
    }
    res.send("The score is not updated")
    //return res.redirect('/dashboard/codes/error') // page showing question not found
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'))

//task to do tomorrow

// implement increament of the point
// check for autofill and qrcode part