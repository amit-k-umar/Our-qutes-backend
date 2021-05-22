const { Users}    = require('../models/users');
const auth        = require('../middleware/auth'); 
const express     = require('express');
const bcrypt      = require('bcrypt');
const router      = express.Router();
const lodash      = require('lodash')
router.get('/me', auth, async(req,res) => {
    const user = await Users.findById(req.user._id).select('-password');
    res.send(user);
})

router.post('/signup',async (req,res) => {
    if(!req.body.name || req.body.name.length < 3) return res.status(401).send('Name is required and minimum length should be 3');

    const {name, email, password} = req.body;

    let user = await Users.findOne({email});
    if(user) return res.status(400).send('Email already register');

    try{
        let user = new Users({ 
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        user = await user.save();

        const token = user.generateAuthToken();
        res.header('x-auth-token',token).send(lodash.pick(user,["name", "email"]));
    }
    catch(ex){
        res.send(ex.message);
    }
})

router.post('/login',async (req,res) => {
    if(!req.body.email || !req.body.password)
       return res.status(400).send("Password and Email are required");

    const {email, password} = req.body;

    let user = await Users.findOne({email});
    if(!user) return res.status(404).send('Invalid Email');

    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) return res.status(404).send('Invalid Password');

    const token = user.generateAuthToken();
    res.send(token);
})


module.exports = router;