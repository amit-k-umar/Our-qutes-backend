const mongoose    = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const jwt         = require('jsonwebtoken'); 


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxilength:50,
        required: true  
    },
    email: {
        type: String,
        minlength: 8,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    expireToken:Date,
    pic:{
     type:String,
     default:"http://res.cloudinary.com/dxwxcamgk/image/upload/v1621721229/g5ijjp66f9iwc0xp16vj.png"
    },
    private:{
     type: Boolean,
     default:false
    },
    followRequest:[{type:ObjectId,ref:"users"}],
    followRequested:[{type:ObjectId,ref:"users"}],
    followers:[{type:ObjectId,ref:"users"}],
    following:[{type:ObjectId,ref:"users"}]
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id : this._id,neme:this.name}, process.env.JWT_KEY);
    return token;
}

const Users = mongoose.model('users',userSchema);

module.exports.Users = Users;