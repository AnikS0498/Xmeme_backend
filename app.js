require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const mongoose = require("mongoose");
const Meme = require("./models/memeSchema");

const app = express();

mongoose.connect(process.env.DB_url, {useNewUrlParser: true, useUnifiedTopology: true},()=>{
  console.log("Database connected");
});

app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));

const PORT = 8080 || process.env.PORT;


app.get("/", (req, res)=>{
  res.send("In home route");
});

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
  }catch(err){
    res.json({messsage: err});
  }
});

app.listen(PORT, ()=>{
  console.log(`Server started at port ${PORT}`);
});
