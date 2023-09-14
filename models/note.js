const mongoose = require('mongoose');
const Joi = require('joi');

const noteSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  type: {
    type: String,
    enum: ['service', 'info'],
    default: 'service',
  },
  description: String,
  picture: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

noteSchema.set('timestamps', true);
const Note = mongoose.model('Note', noteSchema);

function validateNote(note) {
  let template = Joi.object().keys({
    titre: Joi.string().min(2).max(50).required(),
    type: Joi.string().valid('service', 'info'),
    description: Joi.string().min(10).max(1024),
    picture: Joi.string(),
    user_id: Joi.string().hex().length(24).required(),
  });

  return template.validate(note);
}

exports.validate = validateNote;
exports.Note = Note;
