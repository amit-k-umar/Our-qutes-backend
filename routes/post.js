const auth        = require('../middleware/auth'); 
const express     = require('express');
const router      = express.Router();
const {Post}=require('../models/posts');
const { result } = require('lodash');
const { Users } = require('../models/users');


// get all posts
router.get('/allpost',auth,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then((posts)=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
    
})

// get posts of folowings only
router.get('/getsubpost',auth, async (req,res )=>{
    await Users.findById({_id:req.user._id}).exec(
        (err,result)=>{
            if(err)
            console.log(err);
            req.user.following=result.following
            Post.find({postedBy:{$in:req.user.following}})
            .populate("postedBy","_id name  pic")
            .populate("comments.postedBy","_id name")
            .sort('-createdAt')
            .then(posts=>{
                res.json({posts})
            })
            .catch(err=>{
                console.log(err)
             })
        }
    )
    
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
    .populate("postedBy","name email pic")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',auth,(req,res)=>{
    Post.findByIdAndUpdate({_id:req.body.postId},{
        $addToSet:{likes:req.user._id}
    },{new:true}).exec(
        (err,result)=>{
            console.log(err);
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
        (err,result)=>{
            if(err)
             res.status(422).json({error:err})
             else res.json(result);
        }
    )
})

router.put('/comment',auth,(req,res)=>{
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
        (err,result)=>{
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
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        console.log(post);
        if(err || !post){
            console.log(err)
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