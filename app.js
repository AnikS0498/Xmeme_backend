require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const mongoose = require("mongoose");
const Meme = require("./models/memeSchema");

const app = express();

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.DB_url, {useNewUrlParser: true, useUnifiedTopology: true},()=>{
  console.log("Database connected");
});

//Cors options
// var whitelist = ['https://x--meme-frontend.herokuapp.com/', 'http://localhost:3000','http://localhost:8080'];
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || ((process.env.Allowed_clients.split(',')).indexOf(origin) !== -1)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

console.log(corsOptions);

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", (req, res)=>{
  res.send("In home route");
});

//route to get all the memes
app.get("/memes",(req, res)=>{
  console.log("In meme route");
  Meme.find({}, (err, memes)=>{
    if(!err)
    {
      res.render("memes",{memes: memes});
    }else{
      console.log(err);
    }
  });
});

//post memes to /memes route and saving it to a mongo cloud database
app.post("/memes", async (req, res)=>{
  console.log(req.body);
  const meme = new Meme({
    memeOwner: req.body.memeOwner,
    memeCaption: req.body.memeCaption,
    memeUrl: req.body.memeUrl
  });
  try{
    const savedMeme = await meme.save();
    console.log("Added to db");
    res.send("Added to db 2");
  }catch(err){
    res.json({messsage: err});
  }
});


//route to get meme of a particular id
app.get("/memes/:id", (req, res)=>{
  Meme.findOne({id: req.params.id},(err, meme)=>{
    if(!err){
      if(meme!=null){
        res.json(meme);
      }else{
        res.json("Meme with id "+ req.params.id+ " is not present");
      }
    }else{
      res.json({message: err});
    }
  });
});


//creating a server
app.listen(PORT || 8080, ()=>{
  console.log(`Server started at port ${PORT}`);
});
