const mongoose = require('mongoose');

const ScoresSchema = new mongoose.Schema({
  activity:    { type: Number, min: 0, max: 100, default: 0 },
  codeQuality: { type: Number, min: 0, max: 100, default: 0 },
  diversity:   { type: Number, min: 0, max: 100, default: 0 },
  community:   { type: Number, min: 0, max: 100, default: 0 },
  hiringReady: { type: Number, min: 0, max: 100, default: 0 },
  overall:     { type: Number, min: 0, max: 100, default: 0 },
}, { _id: false });

const RepoSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  language:    { type: String, default: 'Unknown' },
  stars:       { type: Number, default: 0 },
  forks:       { type: Number, default: 0 },
  url:         { type: String, default: '' },
  topics:      { type: [String], default: [] },
}, { _id: false });

const LanguageSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  percent: { type: Number, required: true },
}, { _id: false });

const ReportSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  name:        { type: String, default: '' },
  avatarUrl:   { type: String, default: '' },
  bio:         { type: String, default: '' },
  followers:   { type: Number, default: 0 },
  publicRepos: { type: Number, default: 0 },
  location:    { type: String, default: '' },
  blog:        { type: String, default: '' },
  scores:      { type: ScoresSchema, required: true },
  topRepos:    { type: [RepoSchema], default: [] },
  languages:   { type: [LanguageSchema], default: [] },

  // Heatmap — { 'YYYY-MM-DD': commitCount } for last 52 weeks
  heatmapData: { type: mongoose.Schema.Types.Mixed, default: {} },

  cachedAt:  { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
