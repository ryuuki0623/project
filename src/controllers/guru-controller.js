/** ================ CALL */
const db = require("../../config/database")
let query

module.exports = class guru {
    static async get_index(req, res){
        try {
            const {data, jml_kls, jml_soal, jml_siswa, kls} = res.locals
            res.render("index-guru", {
                layout: "layout-guru.ejs",
                data: data,
                total: {
                    jml_kls, jml_siswa, jml_soal
                }
            })
        } catch (error) {
            console.error(error)
        }     
    }

    static get_nilai(req, res){
        res.render("nilai-guru", {
            layout: "layout-guru.ejs",
            data: res.locals.data // di push malah buat index baru
        })    
    }
    static get_nilai_detail(req, res){
        res.render("nilai-detail-guru", {
            layout: "layout-guru.ejs",
            data_siswa: res.locals.data,
            data_nilai: res.locals.hasil
        })
    }
    static get_soal(req, res){
        res.status(200).json({
            pesan: "/soal"
        })
    }
    static set_soal(req, res){
        
    }
}
