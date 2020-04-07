/** =============================================== CALL */
const db = require("../../config/database")
let query,status
module.exports = class siswaMid {

        //jika ada pergantian data/update data secara tiba-tiba...backup ke route index

        static get_history(req, res, next){
            query = "SELECT * FROM tb_nilai WHERE nis = ?"
            db.query(query, [req.session.user], (err, history)=>{
                if(err) throw err
                if(!history.length){
                    res.locals.history = false
                    res.locals.tgl_soal = false
                    return next()
                }
                const tgl = history[0].tgl  
                res.locals.history = history
                res.locals.tgl_soal = tgl.toISOString().slice(0,10)
                return next()
            })
        }

        static async cekStatus(req, res, next){  
            req.session.aksesSoal = true // cegah akses ke route soal aktif
            try {
                const tgl = await new Date().toISOString().slice(0,10)
                //console.log(tgl)
                query = "SELECT * FROM tb_soal WHERE status = 1 AND tgl = ?" //harusnya cmn satu yg status true / 1
                db.query(query,[tgl], (err, data)=>{
                    if(err) throw err
                    if(!data.length){
                        console.log("gak ada data")
                        status = false //dipakai di dalam middleware
                        res.locals.status = false //dipakai sepanjang route
                        return next()
                    }                 
                    //sdh ujian jika data ada
                        query = "SELECT * FROM tb_nilai WHERE id_m = '"+data[0].id_m+"' AND nis = ?"
                        db.query(query,[req.session.user], (err, result)=>{
                            if(err) throw err
                            if(!result.length){ // dianggap siswa belum pernah ujian 
                                res.locals.guru = data[0].nip //dipakai sepanjang route
                                status = true //dipakai di dalam middleware
                                res.locals.status = true //dipakai sepanjang route
                                return next()
                            }
                            //jika ada result, maka siswa sudah pernah ujian
                            query = "SELECT * FROM tb_nilai WHERE tgl = ?"
                                db.query(query,[tgl], (err, hasil)=>{ //cek lagi khusus yg sesuai dgn hari ini
                                    if(err) throw err
                                    if(!hasil.length){ //jika belum ujian
                                        res.locals.guru = data[0].nip //dipakai sepanjang route
                                        status = true //dipakai di dalam middleware
                                        res.locals.status = true //dipakai sepanjang route
                                        return next()
                                    }
                                    //jika sudah ujian
                                    res.locals.guru = data[0].nip //dipakai sepanjang route
                                    status = false //dipakai di dalam middleware
                                    res.locals.status = false //dipakai sepanjang route
                                    return next()
                                })
                        })                    
                })
            } catch (err) {
                console.error(err)
            }         
        }

        static cekUjian(req, res, next){
            if(status){
                console.log("akses ujian di perbolehkan")
                return next()
            }  
            console.log("akses ujian di larang")       
            res.redirect("/siswa")
        }
}