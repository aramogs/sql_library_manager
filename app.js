const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
//Database
const db = require('./config/database');
app.set('view engine', 'pug');
//body parser
app.use(bodyParser.urlencoded({extended: false}));
//add static CSS files
app.use('/static', express.static('public'));


//test db
db.authenticate()
    .then(() => console.log('connected'))
    .catch(err => console.log('Error: ' + err))

app.get('/', (req, res) => res.redirect('/books'));

//books route
app.use('/books', require('./routes/books'));

//error handler for 404, using next will pass the err object into the next error handling middleware.
app.use((req, res, next) => {
    err = new Error('Not found!');
    err.status = 404;
    next(err);
});

//error handlers always take 4 args, err obect can be passed from a next method.
app.use((err, req, res, next) => {
    res.locals.error = err;
    console.log('Error status:', err.status);
    res.status(err.status || 500);
    if(err.status === 404){
        res.render('errorNotFound');
    } else {
        res.render('error');
    }
});

db.sync()
.then(() => {
    app.listen(process.env.PORT || 3000, () => console.log('Application running on localhost:3000'));
});