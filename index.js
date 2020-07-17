const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { sendWelcomeEmail } = require('./account');

const router = new express.Router();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));



app.get("/", (req, res) => {
    res.render("landing");
})

app.post('/', (req, res) => {
    const User = req.body;
    sendWelcomeEmail(User.name, User.email, User.message);
    res.redirect('/');
})


app.listen(9911, () => {
    console.log('server is up on port ' + 9911);
})