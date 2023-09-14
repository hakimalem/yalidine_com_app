const mongoose = require('mongoose');

const wilayaSchema = new mongoose.Schema({
  nom: String,
});

wilayaSchema.set('timestamps', true);

const Wilaya = mongoose.model('Wilaya', wilayaSchema);

exports.Wilaya = Wilaya;
