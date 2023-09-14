const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const { validate, User } = require('../models/user');
const _ = require('lodash');

router.get('/me', auth, async (req, res) => {
  const currentUser = await User.findById(req.user._id).select('-password');
  res.send(currentUser);
});

router.post('/', [auth, admin], async (req, res) => {
  req.body.createdBy = req.user._id;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if this user is not already register

  let user = await User.findOne({ email: req.body?.email }); // filter user by an attribute (email) because its a unique attribute
  if (user) return res.status(400).send('User aldready registered !');

  //   // else user is Null
  user = new User(
    _.pick(req.body, [
      'name',
      'email',
      'password',
      'role',
      'telephone',
      'agence_id',
      'fonction_id',
      'createdBy',
    ])
  );

  // we hach the password + the salt
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // saving the hashed user
  await user.save();

  // getting the token that we created in the user model
  const token = user.generateAuthToken();

  res
    .header('x-auth-token', token)
    .send(_.pick(user, ['name', 'email', '_id', 'role', 'createdAt']));
});

module.exports = router;
