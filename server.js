/** ================ CALL */
const http = require("http")
const app = require("./src/app")
const server = http.createServer(app)
const port = process.env.PORT || 8080

server.listen(port, (err)=>{
    if(err) throw err
    console.log("Connected on Port ",port)
})
