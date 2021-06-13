var path = require('path')
const express = require('express')
const dotenv = require('dotenv');
//const request = require('request');
dotenv.config();

let data = "Not Connected";
let terminator = "terminator";
let distance = 0;

const port = process.env.PORT || 8081;
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
app.use(express.static('src/client'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('src/client/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
})

let globalTimout;

app.post('/postdata',receiveData);
app.post('/getdata',sendData);

function receiveData(req, res){
  clearTimeout(globalTimout);
  data = req.body.data;
  distance = parseInt(req.body.distance);
  res.send(terminator);
  globalTimout = setTimeout(function(){
    data = "Not Connected"
  }, 10000);
}

function sendData(req, res){
  res.send({"data": data, "distance": distance});
}
module.exports = app;
