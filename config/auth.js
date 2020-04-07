const LocalStrategy = require("passport-local").Strategy
const db = require("./database")
const bcrypt = require("bcryptjs")
let query = "SELECT * FROM akun WHERE username = ?"

module.exports = (passport)=>{

    //passport serialize checking when login compare with session
    passport.serializeUser((user, done) => {
        done(null, user.username);
      })
    
    //passport deserialize checking when login compare with db
    passport.deserializeUser((username, done) => {
        db.query("SELECT username FROM akun WHERE username = '"+username+"'", (err, user)=>{
            done(err, user)
        })
    })
    //strategy local
    passport.use("local-login",
        new LocalStrategy({ 
        usernameField: "username", 
        passwordField:"password",
        passReqToCallback: true
    }, (req, username, password, done)=>{
        db.query(query, [username], (err, user)=>{
            if(err){
                return done(err)
            }       
            if(!user.length){
                return done(null, false, {message : "Username Tidak Terdaftar"}) 
            }
            if(!bcrypt.compareSync(password, user[0].password)){
                return done(null, false, {message : "Password Salah"})
            }
            if(req.body.hak !== user[0].hak){
                return done(null, false, {message : "Anda Bukan "+req.body.hak})
            }
                return done(null, user[0])                                          
        })                         
    }))
}
//     //strategy jwt
//     passport.use(new JWTStrategy({
//         jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//         secretOrKey   : 'lufeschan'
//     },
//     function (jwtPayload, cb) {
//         //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
//         return  db.query("SELECT id FROM akun WHERE id = '"+jwtPayload.id+"'"), (err, user)=>{
//             if(err) return cb(err)
//             return cb(null, user)
//         }
//     }
// ))
    