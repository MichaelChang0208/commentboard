const express = require('express');
const router = express.Router();
const Post = require('../models/post');
//引入確認是否登入的js
const checkAuthenticated = require('../config/checkauthenticated');
//posts 首頁  秀出所有留言
router.get('/',async(req, res, next) => {
    try{
        const posts = await Post.find();
        //因為最新的留言要在最上面，所以要reverse()
        res.render('posts', {
            posts:posts.reverse()
        });
        
    }catch(err){
        res.status(500).json({message:err.message});
    }
   
});

router.post('/', async(req, res) => {
    const newpost = new Post({
        author:req.body.author,
        content:req.body.content,
        time:req.body.time,
    })
    try{
        newpost.user_id = req.user.id;
        await newpost.save();
        res.json(newpost);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

//delete one
router.delete('/delete/:id', async(req, res) => {
    //用form傳資料再用後端連接資料庫刪除資料 再重新導回所有留言的頁面
    // try{
    //     await Post.deleteOne({ "_id" : req.params.id });
    //     res.redirect('/posts');
    // }catch(err){
    //     res.status(500).json({message:err.message});
    // }
    //用前端fetch ajax 傳資料 再用後端連接資料庫刪除資料 再回傳資料 動態產生刪除的效果
    try{
        await Post.deleteOne({ "_id" : req.params.id });
        res.send({status:'SUCCESS'});
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

//PATCH One
router.put('/put/:id', async(req, res) => {
    //用form傳資料再用後端連接資料庫刪除資料 再重新導回所有留言的頁面
    // try{
    //     await Post.deleteOne({ "_id" : req.params.id });
    //     res.redirect('/posts');
    // }catch(err){
    //     res.status(500).json({message:err.message});
    // }
    //用前端fetch ajax 傳資料 再用後端連接資料庫刪除資料 再回傳資料 動態產生刪除的效果
    console.log(req.body)
    try{
        await Post.updateOne({ "_id" : req.params.id },{"content":req.body.content});
        res.send({
            status:'SUCCESS',
            data:req.body.content
        });
    }catch(err){
        res.status(500).json({message:err.message});
    }
});


module.exports = router ;