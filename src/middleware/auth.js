class auth {
    static login(req, res, next){
      //sett back browser false
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
        res.header('Expires', '-1')
        res.header('Pragma', 'no-cache')
        console.log("login : ",req.isAuthenticated())
        if (req.isAuthenticated()) {
          //save route tujuan
          req.session.data = req.originalUrl
          return next()
        }
        res.redirect("/login")
    }

    static gkLogin(req, res, next){
      if (req.isAuthenticated()) {
        //mengembalikan ke route jika sdh login 
          return res.redirect(req.session.data)
      }
      return next()
    }

    static cekType(req, res, next){
      const join = "/"+req.session.type
      console.log(join)
      console.log(req.baseUrl)
      if(join == req.baseUrl){
        return next()
      } 
      res.redirect("/"+req.session.type)
    }
}

module.exports = auth