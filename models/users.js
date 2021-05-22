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
     default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id : this._id,neme:this.name}, process.env.JWT_KEY);
    return token;
}

const Users = mongoose.model('users',userSchema);

module.exports.Users = Users;