const Joi = require('joi');
const mongoose = require('mongoose');
const { Salle } = require('./salle');

const reservationSalleSchema = new mongoose.Schema({
  etat: {
    type: String,
    enum: ['accepte', 'refuse', 'en attente'],
    default: 'en attente',
  },
  reponsePar: {
    type: mongoose.Schema.Types.ObjectId,
  },
  date_debut: Date,
  date_fin: Date,
  deletedAt: Date,
  deleted: {
    type: Boolean,
    default: false,
  },
  demandePar: {
    type: mongoose.Schema.Types.ObjectId,
  },
  salle_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
});

reservationSalleSchema.set('timestamps', true);

const ReservationSalle = mongoose.model('Reservation', reservationSalleSchema);

async function checkForConflicts(salle_id, date_debut, date_fin) {
  const conflictingReservation = await ReservationSalle.findOne({
    salle_id,
    etat: 'accepte',
    $or: [
      {
        date_debut: { $lt: date_fin },
        date_fin: { $gt: date_debut },
      },
      {
        date_debut: { $gte: date_debut, $lt: date_fin },
      },
      {
        date_fin: { $lte: date_fin, $gt: date_debut },
      },
    ],
  });

  return conflictingReservation;
}

async function validateReservation(reservation) {
  let template = Joi.object().keys({
    date_debut: Joi.date().required(),
    date_fin: Joi.date().required(),
    demandePar: Joi.string().hex().length(24).required(),
    salle_id: Joi.string().hex().length(24).required(),
    participants: Joi.array().items(Joi.string().hex().length(24)).required(),
  });

  const { error } = template.validate(reservation);
  if (error) {
    return { error: error.details[0].message };
  }

  const { salle_id, date_debut, date_fin } = reservation;
  if (date_debut > date_fin) {
    return { error: 'Invalid dates (start_date > end_date)' };
  }
  if (date_debut < new Date().toISOString()) {
    return { error: 'Invalid date' };
  }
  const conflict = await checkForConflicts(salle_id, date_debut, date_fin);

  if (conflict) {
    return { error: 'There is a conflicting reservation at that time.' };
  }

  const salle = await Salle.findById(salle_id);
  if (!salle) {
    return { error: 'this room does not exist' };
  }

  if (reservation.participants.length > salle.nombre_personnes) {
    return {
      error: `this room is up to ${salle.nombre_personnes} persons only`,
    };
  }
  return { value: reservation };
}

exports.validate = validateReservation;
exports.ReservationSalle = ReservationSalle;
