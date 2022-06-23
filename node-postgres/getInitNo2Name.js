var Crawler = require("crawler");
var json = require("JSON")

var c = new Crawler()

const cred = require('./cred')
const Pool = require('pg').Pool
const pool = new Pool({
	user: cred.user,
	host: cred.host,
	database: cred.name,
	password: cred.password,
	port: cred.port,
});

var cur = new Date()
cur.setFullYear('2022', '05', '22')
let year = cur.getFullYear()
let month = ("0" + (cur.getMonth() + 1)).slice(-2)
let date = ("0" + cur.getDate()).slice(-2)
c.queue( {
	uri : `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${year}${month}${date}&type=ALLBUT0999&_=1655967952485`,
	jQuery : false,
	callback : (err, res, done) => {
		if(err) {
			console.log(err)
		}
		else {
			var obj = json.parse(res.body)
			var stockNo = obj.data9.map( ( value, index ) => { return value[0] } )
			var stockName = obj.data9.map( ( value, index ) => { return value[1] } )
			for(var i = 0; i < stockNo.length; i ++) {
				pool.query(`insert into no2name ( stockNo, stockName ) values ( '${stockNo[i]}', '${stockName[i]}' )`)
				.catch((err) => {
					console.log(err)
				})
			}
		}
	}
})