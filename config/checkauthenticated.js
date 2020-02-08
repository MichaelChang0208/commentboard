
//確認是否已經登入
function checkAuthenticated(req, res, next) {
    //如果已經登入
    if(req.isAuthenticated()){
       return next();
    }
}
module.exports = checkAuthenticated;