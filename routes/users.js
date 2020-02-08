const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const cheakAuthenticated = require('../config/checkAuthenticated');
const cheakNotAuthenticated = require('../config/checkNotAuthenticated');
// /*Login Page */
router.get('/login',cheakNotAuthenticated, (req, res) => {
    res.render('./users/login');
});

/*Register Page */
router.get('/register',cheakNotAuthenticated, (req, res) => {
    res.render('./users/signup');
});

/*Register Handle */
router.post('/register',(req, res)=>{
    // console.log(req.body)
    const {username , email , password , password_confirmation} = req.body;
    //在資料庫查找信箱是否註冊過了
    User.findOne({email:email})
        .then(user => {
            if(user){
                //如果有註冊過了
                return res.json({
                    status:'error',
                    errors:'此電郵已註冊過'
                });
            }else{
                //沒有註冊過也沒有任何錯誤執行以下
                const newUser = new User({
                    username,
                    email,
                    password
                });
                //密碼加密 hash password 
                bcrypt.hash(newUser.password, 10 ,(err, hash) => {
                    if(err){
                        return res.status(500).json({error:err});
                    }else{
                        newUser.password = hash;
                        newUser.save()
                        .then(result =>{
                            req.flash('success_msg','註冊成功，現在您可以登入')
                            res.json({
                                status:'success',
                            })
                        })
                        .catch(err => console.log(err));
                    }
                });
            }
        })
    
   
});

/*Login Handle */
router.post('/login', passport.authenticate('local', {
    successRedirect:'/posts',
    failureRedirect:'/users/login',
    failureFlash:true
}));

/*Logout Handle */
router.get('/logout' ,(req, res) => {
    req.logout();
    req.flash('success_msg','您已成功登出');
    res.redirect('/users/login'); 
});

/* user:id */
router.get('/:id', cheakAuthenticated, (req, res, next) => {
    try {
        res.render('./users/user_id'); 
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});
/*delete */
router.delete('/:id', cheakAuthenticated, (req, res, next) => {
    try {
        res.render('./users/user_id'); 
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});

//getting user id
async function getUser(req, res, next){
    let user;
    try{
        user = await User.findById(req.user.id);
        if(user == null){
            return res.status(404).json({message:'Cannot find user'});
        }
    }catch(err){
        return res.status(500).json({message:err.message});
    }
    res.user = user;
    next();
}

module.exports = router ;