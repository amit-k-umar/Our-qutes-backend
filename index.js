const express= require("express")
const mongoose=require('mongoose')
//const env=require('dotenv')

const app=express();
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
var cors = require('cors');
app.use(cors());
// env.config();


   
mongoose
  .connect(
    `mongodb+srv://ami:BeHuman%23123@cluster0.cl0vb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("NOT CONNECTED", err);
  });

const PORT = process.env.PORT || 3000;

app.get('/',(req,res)=>{
  res.send("runing");
})
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use('/user',require('./routes/user'))

// listening on the port
app.listen(PORT, function() {
  console.log('listening on *:3000');
});