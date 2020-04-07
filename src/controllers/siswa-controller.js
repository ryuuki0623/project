/** =============================================== CALL */
const db = require("../../config/database")
let user = [], guru_nip, query, data_ujian

/** =============================================== CONTROLLER */
module.exports = class siswa {

    static async get_index(req, res){      
            const {status, history, tgl_soal, guru} = res.locals
            guru_nip = guru
            console.log("Status : ",status)
            console.log("History : ",history)
            console.log("N I P : ",guru_nip)
            query = "SELECT * FROM tb_siswa WHERE nis = ?"
            try {
                if(!user.length){
                    await user.push(req.session.user)
                }                 
                db.query(query, [user], (error, hasil)=>{
                    hasil.forEach(e => {
                        if(error){
                            console.log("Error : ",error)
                        }else{  
                            res.render("index-siswa", {
                                layout: "layout-siswa.ejs", 
                                hasil: e , 
                                status: status, 
                                history: history, 
                                tgl_soal: tgl_soal
                            })
                        }
                    })         
                })
            } catch (err) {console.error(err)}          
    }
    static get_detail(req, res){
        db.query(query, [user], (error, hasil)=>{
            hasil.forEach(e => {
                if(error){ console.log("Error : ",error) } else {  
                    res.render("detail-siswa", {
                        layout: "layout-siswa.ejs",
                        hasil: e
                    })
                }
            })
        })
     }
     static get_ujian(req, res){
            req.session.aksesSoal = false
            const tgl = new Date().toISOString().slice(0,10)
            query = "SELECT * FROM tb_siswa INNER JOIN tb_soal ON tb_siswa.id_k = tb_soal.id_k WHERE tb_soal.status = 1 && tb_soal.tgl = ? "
            db.query(query, [tgl], (err, result)=>{
                if(err) throw err
                if(!result.length){ res.redirect("/siswa") } // memastikan jika ada kesalahan
                //console.log(result[0])
                db.query("SELECT guru.nama, tb_mapel.ket FROM guru INNER JOIN tb_mapel ON guru.id_m = tb_mapel.id_m WHERE guru.nip = ? ",
                    [result[0].nip], 
                   async (err, data)=>{
                       try {
                            if(err) throw err
                            //console.log("============================")
                            //console.log("Guru : ",data[0].nama)
                            //console.log("Data : ",result[0] )
                            data_ujian = await result[0]
                            res.render("ujian-siswa", {
                                    layout: "layout-siswa.ejs",
                                    data: result[0],
                                    guru: data[0],
                                    tgl: tgl
                            })
                       } catch (err) {
                           console.error(err)
                       }
                         
                    })              
            })
    }

    static get_soal(req, res){
        query = "SELECT * FROM tb_siswa INNER JOIN tb_soal ON tb_siswa.id_k = tb_soal.id_k WHERE tb_soal.status = 1"
        db.query(query, (err, result)=>{
            if(err) throw err
            res.render("soal", {
                layout: "layout-ujian.ejs",
                data: result
            })
        })    
    }

    static async post_soal(req, res){
        try {
            //cek nilai 
            const {data} = await res.locals     
            //console.log(data.benar[i]) //var x = data.benar[i].split("=")[1] //console.log(x)  
               for (let i = 0; i < data.benar.length; i++) { var benar = i+1 } //benarnya
               //console.log(data.salah[i]) //var y = data.salah[i].split("=")[1]
               for (let i = 0; i < data.salah.length; i++) { var salah = i+1 } //salahnya
            //    var jml_soal, jml_bnr, ttl_salah, ttl_benar
                    if(salah == undefined){
                        var jml_soal = benar, jml_bnr = benar , ttl_salah = 0 , ttl_benar = benar
                    }else if(benar == undefined){
                        var jml_soal = salah , jml_bnr =  0 , ttl_benar = 0 , ttl_salah = salah
                    }else{ 
                        var jml_soal = benar + salah , jml_bnr = benar , ttl_benar = benar , ttl_salah = salah
                    }      
                const nilai = await (100 / jml_soal) * jml_bnr
                console.log(nilai)  
                    //masukkan nilai yang sudah didapat
                query = await "INSERT into tb_nilai VALUES('', '"+
                        ttl_benar+"', '"+ttl_salah+"', '"+
                        new Date().toISOString().slice(0,10)+"', 1, '"+req.session.user+"', '"+
                        data.mpl+"', '"+data.kls+"', '"+nilai+"')"
                db.query(query, (err, result) => {
                        if(err) throw err
                        //set status siswa jadi false
                        query = "UPDATE tb_siswa SET status = 0 WHERE nis = ?"
                        db.query(query, [req.session.user],  (err, result)=>{
                                if(err) throw err
                                return res.redirect("/siswa")                
                        })
                    } )
        } catch (err) {
            console.error(err)
        }
    }
}

