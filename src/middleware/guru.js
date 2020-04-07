/** =============================================== CALL */
const db = require("../../config/database")
let query, jml_soal = [], kls = [], sensei = [],  nsiswa = []
/** =============================================== exports */
module.exports = class guru{
    static get_data_index(req, res, next){
            //for find how much "kelas" was managed by teacher
            const pengajar = new Promise((resolve, reject)=>{
                query = "SELECT id_k FROM tb_pengajar WHERE nip = ?"
                db.query(query, [req.session.user], (err, result)=>{
                    if(err) return reject(err)
                    if(!kls.length){
                      result.forEach(e => {
                        //console.log(e)
                        kls.push(e.id_k)
                      })
                    }
                    resolve(result)
                })
            })
            pengajar.then(()=>{
                //console.log("from resolve",resolve) => data kls yg diajar oleh pengajar
                //for find how much "soal" was maked by teacher
                return new Promise((resolve,reject) => {
                    query = "SELECT tgl FROM tb_soal WHERE nip = '"+req.session.user+"' ORDER BY tgl"
                    db.query(query, (err, result)=>{
                        if(err) return reject(err)
                        //if(!result) return reject(err)
                        result.forEach(e => {
                            const data = (e.tgl + 1).slice(0,59)
                            jml_soal.push(data)
                        })
                        //filter duplicates data from tanggal
                        const tgll = [...new Set(jml_soal)]
                        jml_soal = []
                        jml_soal.push(tgll)
                        return resolve(tgll)
                    })
                })
            }, (err) => {
                console.error("SUDAH ERROR BRO : ",err)
                //on future, let's make route for errors :)
            }).then(() => {
                return new Promise((resolve, reject)=>{
                    query = "SELECT * FROM guru JOIN tb_pengajar ON guru.nip = tb_pengajar.nip WHERE guru.nip = '"+req.session.user+"'"
                        db.query(query, (err, result)=>{
                            if(err) return reject(err)
                            //if(!result) return reject(err)
                            //console.log(result)
                            resolve(result)
                        })
                })
            }, (err) =>{
                console.error(err)
                //on future, let's make route for errors :)
            }).then( (guru) => {
                sensei.push(guru)
            //console.log("jumlah soal", jml_soal[0].length)
            //cek jumlah siswa yang diajar
            //console.log("cookie", req.signedCookies)
                return new Promise((resolve, reject)=>{
                    db.query("SELECT * FROM tb_siswa WHERE id_k IN (?)", [kls], (err, result)=>{
                        //console.log("data : ",result)
                        //if(!result) return reject(err)
                        if(err) return reject(err)
                        //console.log("hasil : ",result.length)
                        resolve(result.length)
                      })
                })
                //console.log(kls.length)             
            }, (err) => {
                console.error(err)
                //on future, let's make route for errors :)
            }).finally((done)=>{
                res.locals = {
                    data: sensei,
                    jml_soal: jml_soal[0].length,
                    kls: kls,
                    jml_kls: kls[0].length,
                    jml_siswa: done
                }
                /*res.locals.data = sense | res.locals.jml_soal = jml_soal[0].length
                res.locals.kls = kls | res.locals.jml_kls = kls[0].length
                res.locals.jml_siswa = done*/
                return next()
            }, (err)=>{
                console.error(err)
                //on future, let's make route for errors :)
            })
    }

    static get_data_nilai(req, res, next){
            const nilai_siswa = new Promise((resolve, reject)=>{
                query = "SELECT * FROM tb_nilai WHERE id_k IN (?)"
                db.query(query, [kls], (err, result)=>{
                    //console.log("result nilai : ",result)
                    if(err) return reject(err)
                    //if(!result) 
                    //console.log("1.",result)
                    resolve(result.filter(e => e.id_m === sensei[0][0].id_m))
                })
            })
            nilai_siswa.then((result)=>{
                if(nsiswa.length){
                    nsiswa = []
                    nsiswa.unshift(result)
                }else{ nsiswa.unshift(result) }
                res.locals.data = nsiswa[0]
                return next()
            }, (err)=>{
                console.error(err)
                //on future, let's make route for errors :)
            })
    }

    static get_data_nilai_detail(req, res, next){
            //console.log(nsiswa[0])
            const hasil = nsiswa[0].find(e => e.id_n === parseInt(req.params.id))
            console.log("hasil : ",hasil)
            const data_siswa = new Promise((resolve, reject)=>{
                query = "SELECT * FROM tb_siswa WHERE nis = ?"
                db.query(query, [hasil.nis], (err, result)=>{
                    if(err) return reject(err)
                    resolve(result)
                })
            })
            data_siswa.then((el)=>{
                //console.log(el[0])
                res.locals.data = el[0]
                res.locals.hasil = hasil
                return next()
            }, (err)=>{
                console.log(err)
                //on future, let's make route for errors :)
            })
    }


}
//console.log(new Date().toJSON().slice(0, 19).replace('T', ' '))
//console.log("From JS : ", Date(Date.now()))
