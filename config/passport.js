// 引入驗證機制： passport-local
const LocalStrategy = require('passport-local').Strategy;
//引入 bcrypt 密碼加密
const bcrypt = require('bcryptjs');
//Load User Model
const User = require('../models/user');

function initialize(passport){
     // 當請 passport 做驗證時，呼叫此 callback 函式，並帶入驗證資訊驗證(email, password, done)
    passport.use(new LocalStrategy({usernameField:'email'},(email, password, done) => {
        //Match User 
        // Mongoose 以email資訊向 MongoDB 查找這位使用者
        User.findOne({email:email})
        .then(user => {
            //如果信箱有誤 輸出訊息 此信箱尚未註冊過
            if(!user){
                  // 如果沒有在資料庫裡找到該位使用者，不提供 Passport 任何使用者資料(false)，但告知失敗原因 原因:此信箱尚未註冊過
                return done(null, false, { message: '此信箱尚未註冊過' });
            }
            //這裡不用else是因為 假設信箱沒有註冊過 就直接不執行下面的程式碼 如果用else 還在執行下面的程式碼 浪費時間以及效能
            //Match password 如果信箱無誤 要確認密碼是否有誤  user.password是 hash過的
            bcrypt.compare(password,user.password,(err, isMatch) => {
                if(err) throw err;

                if(isMatch){
                    // 驗證成功時，提供 Passport 該名使用者資料
                    return done(null, user);
                }else{
                    // 驗證失敗時，不提供 Passport 任何使用者資料(false)，但告知失敗原因 原因:請檢查信箱與密碼是否正確
                    return done(null, false, { message: '登入失敗！請檢查信箱與密碼是否正確。' })
                }
            }); 
        }).catch(err => console.log(err));
        })
    );
    // 驗證成功並取得使用者資訊後，將經過一序列化serializeUser()
    // 將使用者user物件中的 id 資訊序列化，存到 session 當中 
    // 序列化後的結果存放在 req.session.passport.user
    passport.serializeUser((user,done) => done(null, user.id));
    // 獲得存取在 session 當中的使用者user物件中被序列化的id之後，到資料庫尋找完整的用戶資料，並將該物件存取到req.user 上。
    passport.deserializeUser((id,done) => {
        User.findById(id, (err,user) => {
            done(err, user);
        });
    });
}
module.exports = initialize;