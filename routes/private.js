const { Users}    = require('../models/users');
const requireAuth       = require('../middleware/auth'); 
const express     = require('express');
const router      = express.Router();


// request to toggle private account
router.get('/requests',requireAuth,async (req,res)=>{
    const {_id}=req.user;
    try{
    const user= await Users.findOne({_id}).populate("followRequest","name email pic")
    res.json(user.followRequest);
    }catch(e){
        res.status(402).json({error:e})
    }
})

router.get('/requesteds',requireAuth,async (req,res)=>{
    const {_id}=req.user;
    try{
    const user= await Users.findOne({_id}).populate("followRequested","name email pic")
    res.json(user.followRequested);
    }catch(e){
        console.log(e);
        res.status(402).json({error:e})
    }
})
router.post('/togglePrivecy',requireAuth,async (req,res)=>{
    const {_id}=req.user;
    const user= await Users.findOne({_id})
    console.log(user);
    user.private=!user.private;
    user.save((err,result)=>{
        console.log(result);
        if(err)
        return res.status(422).json({error:err})
        result.password='';
        res.json(result);
    })
})
// request to follow some one
router.put('/requstFollow/:id',requireAuth,(req,res)=>{
    Users.findByIdAndUpdate(req.params.id,{
        $addToSet:{followRequest:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      Users.findByIdAndUpdate(req.user._id,{
        $addToSet:{followRequested:req.params.id}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})
// accept the request
router.put('/acceptRequest/:id',requireAuth, async (req,res)=>{
    Users.findByIdAndUpdate(req.user._id,{
        $pull:{followRequest:req.params.id},
        $addToSet:{follower:req.params.id}
      
    },{
        new:true
    },(err,resu)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      Users.findByIdAndUpdate(req.params.id,{
        $pull:{followRequested:req.user._id},
        $addToSet:{following:req.user._id}
          
      },{new:true}).then(result=>{
          resu.password='';
          res.json(resu)
      }).catch(erro=>{
          return res.status(422).json({error:erro})
      })

    }
    )
})

//reject the request
router.put('/ignoreRequest/:id',requireAuth, async (req,res)=>{
    Users.findByIdAndUpdate(req.user._id,{
        $pull:{followRequest:req.params.id},
       
      
    },{
        new:true
    },(err,resu)=>{
        if(err){
            console.log(err);
            return res.status(422).json({error:err})
        }
      Users.findByIdAndUpdate(req.params.id,{
        $pull:{followRequested:req.user._id},
        
          
      },{new:true}).then(result=>{
          resu.password='';
          res.json(resu)
      }).catch(erro=>{
          console.log(erro);
          return res.status(422).json({error:erro})
      })

    }
    )
})
// cancel a request
router.put('/cancelRequest/:id',requireAuth, async (req,res)=>{
    Users.findByIdAndUpdate(req.user._id,{
        $pull:{followRequested:req.params.id},
       
      
    },{
        new:true
    },(err,resu)=>{
        if(err){
            console.log(err);
            return res.status(422).json({error:err})
        }
      Users.findByIdAndUpdate(req.params.id,{
        $pull:{followRequest:req.user._id},
        
          
      },{new:true}).then(result=>{
          resu.password='';
          res.json(resu)
      }).catch(erro=>{
          console.log(erro);
          return res.status(422).json({error:erro})
      })

    }
    )
})


module.exports = router
