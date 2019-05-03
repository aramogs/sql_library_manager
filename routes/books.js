const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Books = require('../models/books');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;


//route for /books, will show all books
router.get('/', (req, res) => {
    Books.findAll()
      .then(books => {
          res.render('index', {books: books});
      })
      .catch(err => console.log(err))
});

//route for new book
router.get('/new', (req, res) => res.render('new-book'));

//post route to add book to db
router.post('/new', (req, res) => {
    let {title, author, genre, year} = req.body;
    Books.create({
        title,
        author,
        genre,
        year
    })
        .then(() => res.redirect('/'))
        .catch(err => {
            if(err.name === "SequelizeValidationError"){
              res.render('new-book', {err: err.errors});
            } else {
                throw err;
            }
        })
        .catch(err => console.log(err))
});

router.get('/search', (req, res) => {
    const { term } = req.query;
    // term = term.toLowerCase();
    Books.findAll({where: {[Op.or]: [
        {
            title: {[Op.like] : '%' + term + '%'}
        },
        {
            author: {[Op.like] : '%' + term + '%'}
        },
        {
            genre: {[Op.like] : '%' + term + '%'}
        },
        {
            year: {[Op.like] : '%' + term + '%'}
        }
    ]}})
        .then(books => {
            res.render('search-results', {books, term});
        })
        .catch(err => console.log(err));
});

//route to update book
router.get('/:id', (req, res) => {
    Books.findByPk(req.params.id)
      .then(book => {
          res.render('update-book', {book});
      })
      .catch(err => console.log(err))
});

//post route to update database
router.post('/:id', (req, res) => {
    Books.findById(req.params.id)
      .then(Book => {
          if(Book){
              return Book.update(req.body);
          } else{
              res.render('error');
          }
      })
      .then(() => res.redirect('/'))
      .catch(err => {
          if(err.name === "SequelizeValidationError"){
            let book = Books.build(req.body);
            book.dataValues.id = req.params.id;
            res.render('update-book', { book, err: err.errors});
          } else {
              throw err;
          }
      })
      .catch(err => console.log(err))
});

//route to delete
router.post('/:id/delete', (req, res) => {
    Books.findById(req.params.id)
      .then(Book => {
          if(Book){
              return Book.destroy();
          } else{
              res.render('error');
          }
      })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
});

module.exports = router;