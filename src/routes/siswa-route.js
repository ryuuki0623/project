/** ================ CALL */

const express = require("express")
const router = express.Router()
const passport = require('passport')

//controller,middleware

const controller = require("../controllers/siswa-controller")
const middleware = require("../middleware/siswa")
const ujian = require("../middleware/ujian")
const jb = require("../middleware/jb")

/** =================== ROUTE SISWA */

//====get
router.get("/", 
    ujian.cekUjianMulai, //cegah siswa balik setelah mulai ujian
    middleware.cekStatus, 
    middleware.get_history, 
    controller.get_index
)

router.get("/detail", 
    ujian.cekUjianMulai, //cegah siswa balik setelah mulai ujian
    controller.get_detail
)

router.get("/ujian", 
    ujian.cekUjianMulai, //cegah siswa balik setelah mulai ujian
    middleware.cekUjian, 
    controller.get_ujian
)
    
router.get("/soal", 
    ujian.cekAksesSoal, //cegah siswa akses soal lebih dulu
    ujian.ujianMulai,
    controller.get_soal
)

//====post

router.post("/soal", 
    jb.cekMapel, 
    jb.cekJawaban, 
    controller.post_soal)

/** ================ END */
module.exports = router