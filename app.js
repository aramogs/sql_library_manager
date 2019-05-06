const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const db = require('./config/database');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));
//Declaring static route
app.use('/static', express.static('public'));


db.authenticate()
    .then(() => console.log('connected'))
    .catch(err => console.log('Error: ' + err))

app.get('/', (req, res) => res.redirect('/books'));
app.use('/books', require('./routes/books'));

app.use((req, res, next) => {
    err = new Error('Not found!');
    err.status = 404;
    next(err);
});

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