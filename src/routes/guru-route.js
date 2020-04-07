/** ================ CALL */
const express = require("express")
const router = express.Router()
const passport = require('passport')

//controller,middleware
const controller = require("../controllers/guru-controller")
const middleware = require("../middleware/guru")

/** ================ ROUTE GURU */
router.get("/", 
    middleware.get_data_index, 
    controller.get_index)

router.get("/nilai", 
    middleware.get_data_nilai, 
    controller.get_nilai)

router.get("/nilai/detail/:id", 
    middleware.get_data_nilai_detail, 
    controller.get_nilai_detail)

router.get("/soal",  controller.get_soal)
router.get("/soal/add",  controller.set_soal)

/** ================ OTHER */
module.exports = router
