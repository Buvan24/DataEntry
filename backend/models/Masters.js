const mongoose = require('mongoose');
const ref = id => ({ type: mongoose.Schema.Types.ObjectId, ref: id });

const districtSchema = new mongoose.Schema({ name: { type: String, required: true } }, { timestamps: true });

const unionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: ref('District'),
}, { timestamps: true });

const assemblySchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: ref('District'),
  union: ref('Union'),
}, { timestamps: true });

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: ref('District'),
  union: ref('Union'),
  assembly: ref('Assembly'),
}, { timestamps: true });

const administrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: ref('District'),
  union: ref('Union'),
  assembly: ref('Assembly'),
  area: ref('Area'),
}, { timestamps: true });

const positionSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true });

module.exports = {
  District:       mongoose.model('District',       districtSchema),
  Union:          mongoose.model('Union',          unionSchema),
  Assembly:       mongoose.model('Assembly',       assemblySchema),
  Area:           mongoose.model('Area',           areaSchema),
  Administration: mongoose.model('Administration', administrationSchema),
  Position:       mongoose.model('Position',       positionSchema),
};
