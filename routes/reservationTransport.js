const express = require('express');
const {
  ReservationTransport,
  validate,
} = require('../models/reservationTransport');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const fileUpload = require('express-fileupload');
const router = express.Router();

// create reservationTransport
router.post(
  '/',
  auth,
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    try {
      if (req.user.role !== 'responsable' && req.user.role !== 'admin') {
        return res.send(
          'access denied, you cannot create transport reservation'
        );
      }
      req.body.demandePar = req.user._id;

      const files = req.files;

      const fileNames = [];

      if (files && Object.keys(files).length > 0) {
        for (const fileKey in files) {
          const file = files[fileKey];
          const fileName = `${Date.now()}_${file.name}`;

          // Move the file to the server with the unique name
          file.mv(`uploads/${fileName}`, (err) => {
            if (err) {
              return res.status(500).send(err);
            }
          });

          fileNames.push(fileName);
        }
      }

      req.body.piece_jointe = fileNames;

      const { error } = validate(req.body);
      if (error) {
        return res.send(error.details[0].message);
      }

      let reservation = await ReservationTransport(req.body);
      reservation = await reservation.save();
      res.send(reservation);
    } catch (error) {
      res.send(error.message);
    }
  }
);

module.exports = router;
