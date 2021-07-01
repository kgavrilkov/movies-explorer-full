const router = require('express').Router();

const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validators');

router.post('/', validateCreateMovie, createMovie);
router.get('/', getMovies);
router.delete('/:_id', validateDeleteMovie, deleteMovie);

module.exports = router;
