const express = require('express')
const app = express()
const port = 3001

const crawler = require('./crawler')
const stockProccess = require('./stockProccess')

app.use(express.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});
app.get('/', (req, res) => {
    res.status(200).send()
})

app.get('/updateDbToDate', (req, res) => {
    crawler.updateDb()
    .then(() => {
        res.status(200).send()
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send()
    })
})

app.get('/query/:stockNo', (req, res) => {
    stockProccess.getStock(req.params.stockNo)
    .then((stocks) => {
        if(stocks.length == 0) {
            res.status(500).send()
        }
        res.status(200).send(stocks)
    })
    .catch((err) => {
        reject(err)
    }) 
})
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})