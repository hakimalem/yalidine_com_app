const Joi = require('joi');
const mongoose = require('mongoose');
const reservationTransportSchema = new mongoose.Schema({
  etat: {
    type: String,
    enum: ['accepte', 'refuse', 'en attente'],
    default: 'en attente',
  },
  reponsePar: mongoose.Schema.Types.ObjectId,
  demandePar: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  transport: String,
  depart: String,
  destination: String,
  piece_jointe: [String],
});
reservationTransportSchema.set('timestamps', true);
const ReservationTransport = mongoose.model(
  'ReservationTransport',
  reservationTransportSchema
);

function validateReservation(reservation) {
  let template = Joi.object().keys({
    etat: Joi.string().min(2).max(50),
    demandePar: Joi.string().hex().length(24).required(),
    transport: Joi.string().min(2).max(400),
    piece_jointe: Joi.array().items(Joi.string()),
    depart: Joi.string(),
    destination: Joi.string(),
  });

  return template.validate(reservation);
}

exports.validate = validateReservation;

exports.ReservationTransport = ReservationTransport;
