const mongoose = require('mongoose');
const Joi = require('joi');

const newsSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  type: {
    type: String,
    enum: ['annonce', 'promotion'],
    default: 'annonce',
  },
  description: String,
  piece_jointe: [String],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

newsSchema.set('timestamps', true);
const News = mongoose.model('News', newsSchema);

function validateNews(news) {
  let template = Joi.object().keys({
    titre: Joi.string().min(2).max(50).required(),
    type: Joi.string().valid('annonce', 'promotion'),
    description: Joi.string().min(10).max(1024),
    piece_jointe: Joi.array().items(Joi.string()),
    user_id: Joi.string().hex().length(24).required(),
  });

  return template.validate(news);
}

exports.validate = validateNews;
exports.News = News;
