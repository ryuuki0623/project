/** ================ CALL */
const mysql = require("mysql")
const conn = mysql.createConnection({ //NTAR GNTI KE POOL
        host : "localhost",
        user: "root",
        password: process.env.DB_PASS,
        database: "sistem_evaluasi"
    }, { multipleStatements: true }
    )

let query = (query, params) => {
                return Promise.using(getSqlConnection(), function (connection) {
                    console.log("Dapet Koneksi")
                    if (typeof params !== 'undefined'){
                        return connection.queryAsync(query, params)
                    } else {
                        return connection.queryAsync(query)
                    }
                })
            }
// const db = function(callback) {
//     conn.getConnection(function(err, connection) {
//         callback(err, connection);
//     });
// };

module.exports = conn