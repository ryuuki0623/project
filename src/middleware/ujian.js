/** =============================================== CALL */
const db = require("../../config/database")
let query
module.exports = class ujian{ 
    static async cekAksesSoal(req, res, next){
        try { 
            if(await req.session.aksesSoal){
                //console.log("akses soal true")
                return res.redirect("/siswa")
            } 
            console.log("akses soal false")
            return next()
        } catch (err) {
            console.error(err)
        }
    }

    static async cekUjianMulai(req, res, next){
        try {
            //sett back browser false
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
            res.header('Expires', '-1')
            res.header('Pragma', 'no-cache')
           query = "SELECT status FROM tb_siswa WHERE nis = ?"
           await db.query(query, [req.session.user], (err, result)=>{
                    if(err) throw err 
                    if(result[0].status){
                       return res.redirect("/siswa/soal")
                    }
                    return next()
                })
        } catch (error) {
            console.error(err)
        }      
    }

    static ujianMulai(req, res, next){
        query = "SELECT status FROM tb_siswa WHERE nis = ?"
        db.query(query, [req.session.user], (err, stts)=>{
            if(err) throw err
            if(stts[0].status == 1){ //jika sudah tersetel..lngsung next
                return next()
            }
            //jika belum,setel dulu
                query = "UPDATE tb_siswa SET status = 1 WHERE nis = ?"
                //console.log("User nis : ",req.session.user)
                db.query(query, [req.session.user],  (err, result)=>{
                        if(err) throw err
                        return next()                  
                })
        })
    }

}