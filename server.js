const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
// let path = require('path')
let app = express()

app.set("view engine", "ejs")

mongoose.connect("mongodb://localhost:27017/eportalDB", {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title: String,
    text: String
});

const Article = mongoose.model('Article', articleSchema)

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/index.html')
})

let t = "Text of the Article"
let T = "Title of the Article"

app.get('/textEditor', (req, res) => {
    console.log(req.params)
    res.render('textEditor', {inTex: '', inTi: ''})
})

app.post('/textEditor', (req, res) => {
    let edText = req.body.text;
    let edTitle = req.body.title;
    let article = new Article({
        title: req.body.title,
        text: req.body.text
    })
    article.save();
    res.render('textEditor', {inTex: edText, inTi: edTitle})
})

app.use(express.static(__dirname))

app.listen(3000, ()=>{
    console.log("Server listening to port 3000")
})
