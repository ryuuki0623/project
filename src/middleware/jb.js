const db = require("../../config/database")
module.exports = class jawaban{
    static cekJawaban(req, res, next){
        //get mapel from query locals   
            const {query} = res.locals //make object
        //console.log(query)
            let jb = req.body
            var benar = [], salah = [], total = []
        //console.log(jb)
            db.query(query, (err, hasil) => {
                if(err) throw err
                    hasil.forEach(d => {
        //console.log(jb[d.id_m+d.id_s])
        /*auto => */if(jb[d.id_m+d.id_s] == d.jawaban){
                        benar.push([d.id_m+d.id_s]+"="
                            +jb[d.id_m+d.id_s]
                            +"=benar")
                    //=> mtk[i]=[i]=benar
                    }else{
                        salah.push([d.id_m+d.id_s]+"="
                            +jb[d.id_m+d.id_s]
                            +"=salah=yangbenar="
                            +d.jawaban)
                        //=> mtk[i]=[i]=salah
                    }
                });
    //===================  next 
            let ttl = []
            ttl.benar = benar, ttl.salah = salah
            ttl.mpl = hasil[0].id_m, ttl.kls = hasil[0].id_k
            res.locals.data = ttl
            return next()
            })        
    }

    static cekMapel (req, res, next){
        let query
        const tgl = new Date().toISOString().slice(0,10)
        query = "SELECT * FROM tb_soal WHERE status = 1 && tgl = ?"
        db.query(query, [tgl], (err, result)=>{
            if(err) throw err
            query = "SELECT * FROM tb_soal WHERE id_m = '"+result[0].id_m+"'" //pake date()
            if(!result[0].id_m){
                return res.redirect("/siswa")
            }    
        //sett to locals
            res.locals.query = query
            return next()
        })
     }
}