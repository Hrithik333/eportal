const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const fs = require('fs');
const { json } = require('body-parser');
let app = express()

app.set("view engine", "ejs")

mongoose.connect("mongodb://localhost:27017/eportalDB", {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title: String,
    text: String
});

const Article = mongoose.model('Article', articleSchema)

app.use(bodyParser.urlencoded({extended: true}));

function dbWrite() {
    Article.find((err, article) => {
        if(err) {
            console.log(err);
        }
        else {
            let obj={
                "db":[]
            }
            article.forEach((element) => {
                obj.db.push(element);
            })
            fs.writeFile("content.json", JSON.stringify(obj), 'utf8', () => console.log("json file added"))
        }
    })
}


app.get('/', (req, res)=> {
    dbWrite();
    res.sendFile(__dirname + '/home.html')
})

let t = "Text of the Article"
let T = "Title of the Article"

app.get('/textEditor', (req, res) => {
    let arr = [];
    Article.find((err, article) => {
        if(err) {
            console.log(err);
        }
        else {
            article.forEach((element) => {
                let elem = '\"' + String(element.title) + '\"'
                arr.push(elem);
            })
            res.render('textEditor', {inTex: '', inTi: '', titleArray: arr})
        }
    })
    // res.render('textEditor', {inTex: '', inTi: ''})
})

app.get('/textEditor/:title', (req, res) => {
    let arr = [];
    console.log(req.params.title)
    Article.find((err, article) => {
        if(err) {
            console.log(err);
        }
        else {
            let title = ""
            let text = "";
            article.forEach((element) => {
                let elem = '\"' + String(element.title) + '\"'
                arr.push(elem);
                if(element.title == req.params.title) {
                    console.log(element);
                    title = element.title;
                    text = element.text;
                }
            })
            res.render('textEditor', {inTex: text, inTi: title, titleArray: arr})
        }
    })
    // res.render('textEditor', {inTex: tex, inTi: ti})
})

app.post('/textEditor', (req, res) => {
    let edText = req.body.text;
    let edTitle = req.body.title;
    let article = new Article({
        title: req.body.title,
        text: req.body.text
    })
    article.save();
    // res.render('textEditor', {inTex: edText, inTi: edTitle})
    res.redirect('/textEditor/'+req.body.title)
})

app.use(express.static(__dirname))

app.listen(3000, ()=>{
    console.log("Server listening to port 3000")
})
