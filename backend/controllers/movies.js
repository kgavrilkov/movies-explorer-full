const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const {
  INCORRECT_DATA, MOVIE_NOT_FOUND, MOVIE_DELETED, FORBIDDEN_DELETE_MOVIE,
} = require('../configs/errorsMessages');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError(INCORRECT_DATA);
      }
      throw err;
    })
    .catch(next);
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movie.findById(_id)
    .orFail(new NotFoundError(MOVIE_NOT_FOUND))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new BadRequestError(FORBIDDEN_DELETE_MOVIE);
      } else {
        return movie.remove()
          .then(() => res.status(200).send({ message: MOVIE_DELETED }));
      }
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
