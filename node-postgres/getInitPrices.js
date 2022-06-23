var Crawler = require("crawler");
var json = require("JSON")

var c = new Crawler({
	rateLimit : 5000
})

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
var today = new Date()
cur.setFullYear('2022', '00', '01')
while(true) {
	let year = cur.getFullYear()
    let month = ("0" + (cur.getMonth() + 1)).slice(-2)
    let date = ("0" + cur.getDate()).slice(-2)
	c.queue({
		uri : `https://www.twse.com.tw/en/exchangeReport/MI_INDEX?response=json&date=${year}${month}${date}&type=ALLBUT0999&_=1655948244368`,
		jQuery : false,
		callback : (err, res, done) => {
			if(err) {
				console.log(err)
			}
			else {
				var obj = json.parse(res.body);
				console.log(`crawled ${obj.date}`)
				if(obj.stat == 'OK') {
					var stockNo = obj.data9.map( ( value, index ) => { return value[0] } )
					var price = obj.data9.map( ( value, index ) => { return value[7] } )
					for(var i = 0; i < stockNo.length; i ++) {
						// console.log(`insert into prices ( date, price, stockNo ) values ( '${year}-${month}-${date}', ${parseFloat(price[i])}, '${stockNo[i]}')`)
						if(price[i] != '--') {
							pool.query(`insert into prices ( date, price, stockNo ) values ( '${year}-${month}-${date}', ${parseFloat(price[i])}, '${stockNo[i]}')`, 
							(err, res) => {
								if(err) {
									console.log(err)
								}
							})
						}
					}
				}
			}
			done()
		}
	})
	if(cur.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
		break;
	}
	cur.setDate(cur.getDate() + 1)
}