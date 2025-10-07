import mongoose from 'mongoose';

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    enum: [
      'Defense & Aerospace',
      'Computing & Information Technology',
      'Energy & Materials',
      'Biotechnology',
      'Robotics & Automation',
      'Cybersecurity',
      'Quantum Technologies',
      'Artificial Intelligence',
      'Advanced Manufacturing',
      'Space Technologies'
    ],
    index: true
  },
  subdomain: {
    type: String,
    trim: true
  },
  currentTRL: {
    type: Number,
    min: 1,
    max: 9,
    default: 1
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['emerging', 'developing', 'mature', 'declining'],
    default: 'emerging',
    index: true
  },
  criticality: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  applications: [{
    type: String,
    trim: true
  }],
  challenges: [{
    type: String,
    trim: true
  }],
  opportunities: [{
    type: String,
    trim: true
  }],
  // AI-generated insights
  aiInsights: {
    trendAnalysis: String,
    marketPotential: String,
    riskAssessment: String,
    competitiveLandscape: String,
    lastUpdated: Date
  },
  // Metadata
  metadata: {
    dataQuality: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    lastAnalyzed: Date,
    analysisCount: {
      type: Number,
      default: 0
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
technologySchema.index({ name: 'text', description: 'text', keywords: 'text' });
technologySchema.index({ domain: 1, status: 1 });
technologySchema.index({ currentTRL: 1, status: 1 });
technologySchema.index({ 'metadata.lastAnalyzed': 1 });

// Virtual for related patents count
technologySchema.virtual('patentCount', {
  ref: 'Patent',
  localField: '_id',
  foreignField: 'technologyId',
  count: true
});

// Virtual for related publications count
technologySchema.virtual('publicationCount', {
  ref: 'Publication',
  localField: '_id',
  foreignField: 'technologyId',
  count: true
});

// Virtual for related companies count
technologySchema.virtual('companyCount', {
  ref: 'CompanyTechnology',
  localField: '_id',
  foreignField: 'technologyId',
  count: true
});

// Pre-save middleware
technologySchema.pre('save', function(next) {
  if (this.isModified('keywords')) {
    this.keywords = [...new Set(this.keywords)]; // Remove duplicates
  }
  next();
});

// Static methods
technologySchema.statics.findByDomain = function(domain) {
  return this.find({ domain }).sort({ currentTRL: -1, name: 1 });
};

technologySchema.statics.findByTRL = function(minTRL, maxTRL) {
  return this.find({
    currentTRL: { $gte: minTRL, $lte: maxTRL }
  }).sort({ currentTRL: -1 });
};

technologySchema.statics.findEmerging = function() {
  return this.find({ status: 'emerging' }).sort({ currentTRL: -1 });
};

technologySchema.statics.searchTechnologies = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { keywords: { $in: [new RegExp(query, 'i')] } }
    ]
  });
};

export default mongoose.model('Technology', technologySchema);
