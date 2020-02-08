
//確認登入後 使不能回到註冊以及登入頁面
function checkNotAuthenticated(req, res, next) {
    //如果已經登入
    if(req.isAuthenticated()){
       return res.redirect('/posts');
    }
    next();
}
module.exports = checkNotAuthenticated;