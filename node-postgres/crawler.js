var Crawler = require("crawler");
var json = require("JSON")


var c = new Crawler({
	rateLimit : 3000
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

function updateDb() {
	return new Promise((resolve, reject) => {
		pool.query('select max(date) from prices', (err, res) => {
			if(err) {
				reject(err)
			}
			var today = new Date()
			var cur = res.rows[0].max
			cur.setDate(cur.getDate() + 1)
			while(cur.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
			    let year = cur.getFullYear()
			    let month = ("0" + (cur.getMonth() + 1)).slice(-2)
			    let date = ("0" + cur.getDate()).slice(-2)
				console.log(`${year}${month}${date}`)
			    c.queue({
			        uri : `https://www.twse.com.tw/en/exchangeReport/MI_INDEX?response=json&date=${year}${month}${date}&type=ALLBUT0999&_=1655948244368`,
			        jQuery : false,
			        callback : (err, res, done) => {
			            if(err) {
			            	reject(err)
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
			                                	reject(err)
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
			resolve()
		})
	})
}

module.exports = {
	updateDb
}