require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

app.use(express.static('./public'));
app.use(express.static('./uploads'));

mongoose.set("strictQuery", false);

const PORT = process.env.PORT || 4000
// database connection
mongoose.connect(process.env.DB_URI, {useNewUrlParser : true , useUnifiedTopology : true});
const db = mongoose.connection;
db.on("error",(error) => console.log(error));
db.once("open",() => console.log('Connected to the database!'));

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next();
})
app.set('view engine', 'ejs');

app.use("", require("./routes/routes"));

app.get('/' , (req,res) => {
    res.send("users ");
})

app.listen(PORT,() => {
    console.log(`Server is running on port: ${PORT}`);
})