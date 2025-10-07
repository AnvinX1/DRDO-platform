import mongoose from 'mongoose';

const patentSchema = new mongoose.Schema({
  patentNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  abstract: {
    type: String,
    required: true
  },
  technologyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technology',
    index: true
  },
  // Filing and publication dates
  filingDate: {
    type: Date,
    required: true,
    index: true
  },
  publicationDate: {
    type: Date,
    index: true
  },
  grantDate: {
    type: Date,
    index: true
  },
  // Geographic and legal information
  countryCode: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },
  legalStatus: {
    type: String,
    enum: ['pending', 'published', 'granted', 'expired', 'abandoned', 'opposed'],
    default: 'pending',
    index: true
  },
  // Assignee and inventor information
  assignee: {
    name: String,
    type: {
      type: String,
      enum: ['individual', 'corporation', 'university', 'government', 'other']
    },
    country: String
  },
  inventors: [{
    name: String,
    country: String
  }],
  // Classification and technical details
  classificationCodes: [{
    system: String, // IPC, CPC, USPC, etc.
    code: String,
    description: String
  }],
  // Citation and impact metrics
  citationCount: {
    type: Number,
    default: 0,
    index: true
  },
  forwardCitations: [{
    patentNumber: String,
    title: String,
    citationDate: Date
  }],
  backwardCitations: [{
    patentNumber: String,
    title: String,
    citationDate: Date
  }],
  // AI analysis results
  aiAnalysis: {
    technicalComplexity: {
      type: Number,
      min: 0,
      max: 1
    },
    commercialPotential: {
      type: Number,
      min: 0,
      max: 1
    },
    noveltyScore: {
      type: Number,
      min: 0,
      max: 1
    },
    keywords: [String],
    concepts: [String],
    lastAnalyzed: Date
  },
  // Market and business intelligence
  marketIntelligence: {
    estimatedValue: Number,
    licensingStatus: String,
    competitiveThreat: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    technologyReadiness: {
      type: Number,
      min: 1,
      max: 9
    }
  },
  // External links and references
  url: String,
  pdfUrl: String,
  // Metadata
  metadata: {
    source: {
      type: String,
      enum: ['USPTO', 'EPO', 'WIPO', 'JPO', 'KIPO', 'CNIPA', 'INDIAN_PATENT', 'other']
    },
    lastUpdated: Date,
    dataQuality: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    processingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
patentSchema.index({ title: 'text', abstract: 'text' });
patentSchema.index({ filingDate: -1 });
patentSchema.index({ countryCode: 1, legalStatus: 1 });
patentSchema.index({ 'assignee.name': 1 });
patentSchema.index({ citationCount: -1 });
patentSchema.index({ 'aiAnalysis.lastAnalyzed': 1 });

// Virtual for age in years
patentSchema.virtual('age').get(function() {
  if (this.filingDate) {
    return Math.floor((Date.now() - this.filingDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  }
  return null;
});

// Virtual for technology readiness based on citations
patentSchema.virtual('citationBasedTRL').get(function() {
  if (this.citationCount === 0) return 1;
  if (this.citationCount < 5) return 2;
  if (this.citationCount < 15) return 3;
  if (this.citationCount < 30) return 4;
  if (this.citationCount < 50) return 5;
  if (this.citationCount < 100) return 6;
  if (this.citationCount < 200) return 7;
  if (this.citationCount < 500) return 8;
  return 9;
});

// Static methods
patentSchema.statics.findByCountry = function(countryCode) {
  return this.find({ countryCode }).sort({ filingDate: -1 });
};

patentSchema.statics.findByAssignee = function(assigneeName) {
  return this.find({ 'assignee.name': { $regex: assigneeName, $options: 'i' } });
};

patentSchema.statics.findHighImpact = function(minCitations = 50) {
  return this.find({ citationCount: { $gte: minCitations } }).sort({ citationCount: -1 });
};

patentSchema.statics.findRecent = function(days = 30) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.find({ filingDate: { $gte: cutoffDate } }).sort({ filingDate: -1 });
};

patentSchema.statics.findByTechnology = function(technologyId) {
  return this.find({ technologyId }).sort({ filingDate: -1 });
};

patentSchema.statics.searchPatents = function(query) {
  return this.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { abstract: { $regex: query, $options: 'i' } },
      { 'assignee.name': { $regex: query, $options: 'i' } },
      { inventors: { $elemMatch: { name: { $regex: query, $options: 'i' } } } }
    ]
  });
};

// Pre-save middleware
patentSchema.pre('save', function(next) {
  if (this.isModified('classificationCodes')) {
    this.classificationCodes = [...new Set(this.classificationCodes.map(JSON.stringify))].map(JSON.parse);
  }
  next();
});

export default mongoose.model('Patent', patentSchema);
