/* eslint-disable func-names */
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const { INVALID_EMAIL, INCORRECT_EMAIL_PASSWORD } = require('../configs/errorsMessages');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: INVALID_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(INCORRECT_EMAIL_PASSWORD));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(INCORRECT_EMAIL_PASSWORD));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
