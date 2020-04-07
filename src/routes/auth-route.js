/** ================ CALL */
const express = require("express")
const router = express.Router()
const passport = require('passport')
//middleware
const authMid = require("../middleware/auth")

/** ================ ROUTE LOGIN */
router.get('/', (req, res) => {
    return res.render('login', { layout : "layout-login.ejs"})
})
router.post('/', (req, res, next)=>{  
    req.session.type = req.body.hak
    if(req.body.hak !== "admin") //selain admin
      req.session.user = req.body.username

    passport.authenticate('local-login',{
        successRedirect: "/"+req.body.hak,
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})

  
  module.exports = router