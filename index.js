const express = require('express')
const mongoose=require('mongoose')
const app= express();
const cors= require('cors');
//require("dotenv/config")
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
const PORT = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());

// db connection
var t=false;
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cl0vb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Database connected");
    t=true;
  })
  .catch((err) => {
    console.log("NOT CONNECTED", err);
  });
// routes


app.get("/",async (req,res)=>{
  res.send(t);
})

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use('/user',require('./routes/user'))
app.use(require('./routes/forgot-password'))
app.use(require('./routes/reset-password'))
app.use(require('./routes/private'))

app.listen(PORT, async ()=>{
  console.log("started server")
})