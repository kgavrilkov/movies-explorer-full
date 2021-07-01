const { celebrate, Joi } = require('celebrate');
const { default: isEmail } = require('validator/lib/isEmail');
const { default: isURL } = require('validator/lib/isURL');

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().custom((value, helper) => {
      if (isEmail(value)) {
        return value;
      }
      return helper.message('При регистрации введён невалидный email');
    }),
    password: Joi.string().min(8).required(),
  }).unknown(true),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (isEmail(value)) {
        return value;
      }
      return helper.message('При логине введён невалидный email');
    }),
    password: Joi.string().min(8).required(),
  }).unknown(true),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().custom((value, helper) => {
      if (isEmail(value)) {
        return value;
      }
      return helper.message('Введён невалидный email');
    }),
  }).unknown(true),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helper) => {
      if (isURL(value)) {
        return value;
      }
      return helper.message('Введённый URL-адрес не валиден');
    }),
    trailer: Joi.string().required().custom((value, helper) => {
      if (isURL(value)) {
        return value;
      }
      return helper.message('Введённый URL-адрес не валиден');
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (isURL(value)) {
        return value;
      }
      return helper.message('Введённый URL-адрес не валиден');
    }),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }).unknown(true),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateUpdateUser,
  validateCreateMovie,
  validateDeleteMovie,
};
