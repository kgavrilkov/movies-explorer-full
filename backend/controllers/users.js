const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs/config');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const {
  DUPLICATED_EMAIL, INCORRECT_DATA, NOT_AUTHORIZED, USER_NOT_FOUND,
} = require('../configs/errorsMessages');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((userId) => {
          User.findById(userId)
            .then((user) => res.send(user));
        })
        .catch((err) => {
          if (err.name === 'MongoError' && err.code === 11000) {
            throw new ConflictError(DUPLICATED_EMAIL);
          }
          if (err.name === 'ValidationError' || err.name === 'CastError') {
            throw new BadRequestError(INCORRECT_DATA);
          }
        })
        .catch(next);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError(NOT_AUTHORIZED);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError(DUPLICATED_EMAIL);
      }
      throw err;
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError(DUPLICATED_EMAIL);
      }
      throw err;
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
