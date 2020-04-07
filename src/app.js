if(process.env.NODE_ENV !== "production"){
  //app.set('trust proxy', 1) // trust first proxy
  require("dotenv").config()
}
const ps = require("ps-node");
// A simple pid lookup 
ps.lookup({
    command: 'node',
    psargs: 'ux'
    }, function(err, resultList ) {
    if (err) {
        throw new Error( err );
    }
      resultList.forEach(function( process ){
        if( process ){
            console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
        }
    });
});
/** =============================================== CALL */
//express
const passportOneSessionPerUser = require('passport-one-session-per-user')
const express = require("express")
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const expressLayouts = require("express-ejs-layouts")
const cookieParser = require('cookie-parser')
const helmet = require("helmet")
//route
const authRoutes = require("./routes/auth-route")
const adminRoutes = require("./routes/admin-route")
const guruRoutes = require("./routes/guru-route")
const siswaRoutes = require("./routes/siswa-route")
//middleware
const authMid = require("./middleware/auth")
require('../config/auth')(passport)
//const methodOverride = require('method-override')

/** =============================================== OTHER */

// EJS
app.use(expressLayouts)
app.set("views", require("path").join(__dirname,"views"))
app.set('view engine', 'ejs')

// BODY
app.use(express.urlencoded({ extended: false }))
//SESSION
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie:{
    httpOnly: true
  }
}))
//cookie
app.use(cookieParser(process.env.SESSION_SECRET))
//secure node app
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
  }
}))
//FLASH
app.use(flash())
//PASSPORT
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportOneSessionPerUser())
app.use(passport.authenticate('passport-one-session-per-user'))
/** =============================================== ROUTE */

app.use("/login", authMid.gkLogin, authRoutes)
app.use("/admin", authMid.login, authMid.cekType, adminRoutes)
app.use("/siswa",  authMid.login, authMid.cekType, siswaRoutes)
app.use("/guru",  authMid.login, authMid.cekType, guruRoutes)

app.get("/", authMid.gkLogin, (req, res)=>{
  //res.cookie('david', 12345, cookieConfig);
  res.status(200).json({
    pesan: "Hello World"
  })
})
app.get("/logout", (req, res)=>{
  req.logOut()
  console.log("logout data : ",req.session.data)
  console.log(req.isAuthenticated())
  res.redirect("/login")
})
//handle not valid route
app.get("*", (req, res)=>{
  res.status(404).json({
    pesan : "Halaman tidak di temukan"
  })
})


/** =============================================== END*/
module.exports = app
