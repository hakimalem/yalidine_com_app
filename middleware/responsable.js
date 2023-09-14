module.exports = function (req, res, next) {
  if (req.user.role !== 'responsable' && req.user.role !== 'admin')
    return res
      .status(403)
      .send('Access denied, Only admin and responsable can do this');
  next();
};
