const mongoose = require('mongoose');
const Joi = require('joi');

const salleSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  nombre_personnes: {
    type: Number,
    required: true,
  },
  datashow: {
    type: Boolean,
    required: true,
  },
  agence_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

salleSchema.set('timestamps', true);
const Salle = mongoose.model('Salle', salleSchema);

function validateSalle(salle) {
  let template = Joi.object().keys({
    nom: Joi.string().min(2).max(50).required(),
    nombre_personnes: Joi.number().integer().min(5).max(255).required(),
    datashow: Joi.boolean().required(),
    agence_id: Joi.string().hex().length(24).required(),
    createdBy: Joi.string().hex().length(24).required(),
  });

  return template.validate(salle);
}

exports.validate = validateSalle;
exports.Salle = Salle;
