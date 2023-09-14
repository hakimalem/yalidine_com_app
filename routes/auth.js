const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models/user');
const _ = require('lodash');
const Joi = require('joi');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  function validate(user) {
    let template = Joi.object().keys({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    });

    return template.validate(user);
  }

  let user = await User.findOne({ email: req.body?.email }); // filter user by an attribute (email) because its a unique attribute
  if (!user) return res.status(400).send('Invalid email or password!');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password!');

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
