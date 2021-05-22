const { Users}    = require('../models/users');
const {Post}=require('../models/posts')
const requireAuth        = require('../middleware/auth'); 
const express     = require('express');
const bcrypt      = require('bcrypt');
const router      = express.Router();

router.put('/updatepic',requireAuth,(req,res)=>{
    Users.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})


router.post('/searchUser',(req,res)=>{
    let searchPattern = new RegExp("^"+req.body.query)
    Users.find({email:{$regex:searchPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})

router.get('/:id',requireAuth,(req,res)=>{
    Users.findById({_id:req.params.id})
    .select("-password")
    .exec((err,user)=>{
        if(err)
        res.status(422).json({error:err});
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
             if(err){
                 return res.json({error:err});
             }
             res.json({user,posts})
         })
       
    })
    
})

router.put('/follow',requireAuth,(req,res)=>{
    Users.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      Users.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})

router.put('/unfollow',requireAuth,(req,res)=>{
    Users.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      Users.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})

module.exports = router