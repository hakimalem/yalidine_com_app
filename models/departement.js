const mongoose = require('mongoose');
const departementSchema = new mongoose.Schema({
  nom: String,
});

departementSchema.set('timestamps', true);

const Departement = mongoose.model('Departement', departementSchema);

exports.Departement = Departement;
