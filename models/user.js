const mongoose = require('mongoose');
const Joi = require('joi');
const JWT = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  telephone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'responsable'],
  },
  agence_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  fonction_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdBy: mongoose.Schema.Types.ObjectId,
});

// creating the generate authentification token function so we call it in the POST

userSchema.methods.generateAuthToken = function () {
  const token = JWT.sign(
    {
      _id: this._id,
      role: this.role,
      fonction: this.fonction_id,
      agence: this.agence_id,
    },
    config.get('jwtPrivateKey')
  );
  return token;
};

userSchema.set('timestamps', true);
const User = mongoose.model('User', userSchema);

function validateUser(user) {
  let template = Joi.object().keys({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    role: Joi.string().min(3).max(20).required(),
    telephone: Joi.string().length(10).required(),
    agence_id: Joi.string().hex().length(24).required(),
    fonction_id: Joi.string().hex().length(24).required(),
    createdBy: Joi.string().hex().length(24).required(),
  });

  return template.validate(user);
}

exports.User = User;
exports.validate = validateUser;
