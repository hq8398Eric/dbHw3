var Crawler = require("crawler");
var json = require("JSON")
 
const getTodayStocks = () => {
    return new Promise((resolve, reject) => {
        var c = new Crawler({
            rateLimit : 500
        });

        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();

        c.queue({uri : `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${year}${month}${date}&type=ALLBUT0999&_=1655886701026`,
        callback : (err, res) => {
            if(err) {
                reject(err)
            }
            else {
                var obj = json.parse(res.body)
                resolve(obj.data9)
            }        
        }, jQuery : false});
    })
}

module.exports = {
    getTodayStocks
}
// // Queue a list of URLs
// c.queue(['http://www.google.com/','http://www.yahoo.com']);
 
// // Queue URLs with custom callbacks & parameters
// c.queue([{
//     uri: 'http://parishackers.org/',
//     jQuery: false,
 
//     // The global callback won't be called
//     callback: function (error, res, done) {
//         if(error){
//             console.log(error);
//         }else{
//             console.log('Grabbed', res.body.length, 'bytes');
//         }
//         done();
//     }
// }]);
 
// Queue some HTML code directly without grabbing (mostly for tests)
// c.queue([{
//     html: '<p>This is a <strong>test</strong></p>'
// }]);