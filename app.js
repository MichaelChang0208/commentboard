const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//let form use pus and delete
const methodOverride = require('method-override');
//passport
const initializePassport = require('./config/passport');
initializePassport(passport);

//db config
// const dbcon = require('./config/keys').MongoURI;
//資料庫
const mongoose = require('mongoose');
//schema裡面添加 unique:true 的話 這裡要加下面這一行 才不會報錯
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true  , useUnifiedTopology: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open',()=>{
    console.log('connected to MongoDB');

})

//set up template engine
app.set('views', path.join(__dirname ,'views'));
app.set('view engine','ejs');

//set up the layout
const expressLayouts = require('express-ejs-layouts');
app.set('layout','layouts/layout');
app.use(expressLayouts);

//set public folder
app.use(express.static(__dirname + '/public'));

//本來要用body-parser 最新版本用下面這兩行行即可
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//flash
app.use(flash());
//session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  }))

//初始化 passport
app.use(passport.initialize());
//有使用 login session 時，需設定這條 middleware
app.use(passport.session());
//method-override
app.use(methodOverride('_method'));
//global value
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
//cors
app.use(cors());
//routes
const postsRouter = require('./routes/posts.js');
app.use('/posts', postsRouter);

const usersRouter = require('./routes/users.js');
app.use('/users', usersRouter);

const port = process.env.PORT || 7000;
app.listen(port, () => {
console.log(`Connceted to sever on port ${port}`);
});