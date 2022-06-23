const express = require('express')
const app = express()
const port = 3001

const merchant_model = require('./merchant_model')
const crawler = require('./crawler')

app.use(express.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});
app.get('/', (req, res) => {
    res.status(200).send()
})

app.get('/updateDb', (req, res) => {
    crawler.updateDb()
    .then(() => {
        res.status(200).send()
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send()
    })
    // .then((stocks) => {
    //     console.log(stocks)
    //     res.status(200).send(response)
    // })
    // .catch((err) => {
    //     console.log(err)
    //     res.status(500).send(error)
    // })
})
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})