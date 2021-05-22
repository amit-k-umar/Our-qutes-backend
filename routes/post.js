const auth        = require('../middleware/auth'); 
const express     = require('express');
const router      = express.Router();
const {Post}=require('../models/posts');
const { result } = require('lodash');


// get all posts
router.get('/allpost',auth,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then((posts)=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
    
})

// get posts of folowings only
router.get('/getsubpost',auth,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","name")
    .populate("comments.postedBy","name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',auth,(req,res)=>{
    const {title,body,pic} = req.body 
    if(!title || !body || !pic){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user._id
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
        req.json({err:"Some thing went wrong"});
    })
})

router.get('/mypost',auth,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","name email")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',auth,(req,res)=>{
    Post.findByIdAndUpdate({_id:req.body.postId},{
        $push:{likes:req.user._id}
    }).exec(
        (result,err)=>{
            if(err)
             res.status(422).json({error:err})
             else res.json(result);
        }
    )
})

router.put('/unlike',auth,(req,res)=>{
    Post.findByIdAndUpdate({_id:req.body.postId},{
        $pull:{likes:req.user._id}
    }).exec(
        (result,err)=>{
            if(err)
             res.status(422).json({error:err})
             else res.json(result);
        }
    )
})

router.put('/comments',(req,res)=>{
    const comment ={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate({_id:req.body.postId},{
        $push:{comments:comment}
    },{new:true})
    .populate("comments.postedBy","name")
    .populate("postedBy","name")
    .exec(
        (result,err)=>{
            if(err)
            {
                console.log(err)
                res.status(422).json({error:err});
            }
            else res.json(result);
        }
    )
})

router.delete('/deletepost/:postId',auth,(req,res)=>{
    Post.findOne({_id:req.body.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

module.exports = router;