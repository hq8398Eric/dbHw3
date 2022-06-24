const cred = require('./cred')
const Pool = require('pg').Pool
const pool = new Pool({
	user: cred.user,
	host: cred.host,
	database: cred.name,
	password: cred.password,
	port: cred.port,
});

function getStock(stockNo) {
	return new Promise((resolve, reject) => {
		pool.query(`select * from prices natural join no2name where stockNo = '${stockNo}' order by date`)
		.then((res) => {
			resolve(res.rows)
		})
		.catch((err) => {
			console.log('test')
			reject(err)
		})
	})
}

module.exports = {
	getStock
}