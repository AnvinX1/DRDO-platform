import { logger } from '../utils/logger.js';
import Technology from '../models/Technology.js';
import Patent from '../models/Patent.js';
import { ForecastModel } from '../models/Forecast.js';

class ForecastingEngine {
  constructor() {
    this.models = new Map();
    this.isInitialized = false;
    this.forecastingInterval = null;
  }

  async initialize() {
    if (this.isInitialized) {
      logger.warn('Forecasting engine is already initialized');
      return;
    }

    logger.info('🧠 Initializing AI Forecasting Engine...');

    try {
      // Initialize different forecasting models
      await this.initializeTRLProgressionModel();
      await this.initializeMarketSizeModel();
      await this.initializeAdoptionRateModel();
      await this.initializeHypeCycleModel();
      await this.initializeConvergenceDetectionModel();

      this.isInitialized = true;
      logger.info('✅ AI Forecasting Engine initialized successfully');

      // Start periodic forecasting
      this.startPeriodicForecasting();

    } catch (error) {
      logger.error('❌ Failed to initialize forecasting engine:', error);
      throw error;
    }
  }

  async initializeTRLProgressionModel() {
    logger.info('📈 Initializing TRL Progression Model...');
    
    // This would integrate with actual ML models
    // For now, we'll implement rule-based forecasting
    this.models.set('trlProgression', {
      name: 'TRL Progression Model',
      type: 'regression',
      description: 'Predicts technology readiness level progression over time',
      parameters: {
        historicalWeight: 0.4,
        patentWeight: 0.3,
        publicationWeight: 0.2,
        marketWeight: 0.1
      }
    });
  }

  async initializeMarketSizeModel() {
    logger.info('💰 Initializing Market Size Model...');
    
    this.models.set('marketSize', {
      name: 'Market Size Forecasting Model',
      type: 'timeSeries',
      description: 'Predicts market size growth using S-curve analysis',
      parameters: {
        adoptionRate: 0.1,
        marketSaturation: 0.8,
        timeHorizon: 5
      }
    });
  }

  async initializeAdoptionRateModel() {
    logger.info('📊 Initializing Adoption Rate Model...');
    
    this.models.set('adoptionRate', {
      name: 'Technology Adoption Rate Model',
      type: 'logistic',
      description: 'Predicts technology adoption rates using diffusion models',
      parameters: {
        innovationCoefficient: 0.03,
        imitationCoefficient: 0.38,
        marketPotential: 1000000
      }
    });
  }

  async initializeHypeCycleModel() {
    logger.info('🎢 Initializing Hype Cycle Model...');
    
    this.models.set('hypeCycle', {
      name: 'Gartner Hype Cycle Model',
      type: 'classification',
      description: 'Classifies technologies in hype cycle phases',
      parameters: {
        peakThreshold: 0.8,
        troughThreshold: 0.3,
        plateauThreshold: 0.6
      }
    });
  }

  async initializeConvergenceDetectionModel() {
    logger.info('🔗 Initializing Technology Convergence Detection Model...');
    
    this.models.set('convergence', {
      name: 'Technology Convergence Detection',
      type: 'clustering',
      description: 'Detects emerging technology convergences',
      parameters: {
        similarityThreshold: 0.7,
        timeWindow: 12, // months
        minPatents: 10
      }
    });
  }

  startPeriodicForecasting() {
    // Run forecasting every 6 hours
    this.forecastingInterval = setInterval(async () => {
      logger.info('🔄 Running periodic forecasting...');
      await this.runForecastingCycle();
    }, 6 * 60 * 60 * 1000); // 6 hours

    logger.info('⏰ Started periodic forecasting (every 6 hours)');
  }

  async runForecastingCycle() {
    try {
      const technologies = await Technology.find({ status: { $in: ['emerging', 'developing'] } });
      
      logger.info(`🔮 Running forecasts for ${technologies.length} technologies`);

      for (const technology of technologies) {
        await this.generateForecastsForTechnology(technology);
      }

      logger.info('✅ Forecasting cycle completed');

    } catch (error) {
      logger.error('❌ Forecasting cycle failed:', error);
    }
  }

  async generateForecastsForTechnology(technology) {
    try {
      logger.info(`🔮 Generating forecasts for: ${technology.name}`);

      // Generate different types of forecasts
      const forecasts = await Promise.allSettled([
        this.generateTRLProgressionForecast(technology),
        this.generateMarketSizeForecast(technology),
        this.generateAdoptionRateForecast(technology),
        this.generateHypeCycleForecast(technology)
      ]);

      // Save successful forecasts
      const successfulForecasts = forecasts
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      if (successfulForecasts.length > 0) {
        await this.saveForecasts(technology._id, successfulForecasts);
        logger.info(`✅ Generated ${successfulForecasts.length} forecasts for ${technology.name}`);
      }

    } catch (error) {
      logger.error(`❌ Failed to generate forecasts for ${technology.name}:`, error);
    }
  }

  async generateTRLProgressionForecast(technology) {
    const model = this.models.get('trlProgression');
    
    // Get historical data
    const patents = await Patent.find({ technologyId: technology._id });
    const historicalTRL = await this.getHistoricalTRL(technology._id);
    
    // Calculate progression factors
    const patentGrowth = this.calculatePatentGrowth(patents);
    const publicationGrowth = await this.calculatePublicationGrowth(technology._id);
    const marketIndicators = await this.calculateMarketIndicators(technology._id);
    
    // Generate forecast
    const forecast = {
      type: 'trl_progression',
      model: model.name,
      confidence: this.calculateConfidence(patentGrowth, publicationGrowth, marketIndicators),
      projections: this.generateTRLProjections(technology.currentTRL, patentGrowth, publicationGrowth, marketIndicators),
      factors: {
        patentGrowth,
        publicationGrowth,
        marketIndicators
      }
    };

    return forecast;
  }

  async generateMarketSizeForecast(technology) {
    const model = this.models.get('marketSize');
    
    // Get market data
    const marketData = await this.getMarketData(technology._id);
    const adoptionData = await this.getAdoptionData(technology._id);
    
    // Apply S-curve model
    const forecast = {
      type: 'market_size',
      model: model.name,
      confidence: this.calculateMarketConfidence(marketData, adoptionData),
      projections: this.generateMarketProjections(marketData, adoptionData, model.parameters),
      methodology: 'S-curve analysis with adoption rate modeling'
    };

    return forecast;
  }

  async generateAdoptionRateForecast(technology) {
    const model = this.models.get('adoptionRate');
    
    // Get adoption indicators
    const adoptionIndicators = await this.getAdoptionIndicators(technology._id);
    
    // Apply diffusion model
    const forecast = {
      type: 'adoption_rate',
      model: model.name,
      confidence: this.calculateAdoptionConfidence(adoptionIndicators),
      projections: this.generateAdoptionProjections(adoptionIndicators, model.parameters),
      methodology: 'Bass diffusion model with market indicators'
    };

    return forecast;
  }

  async generateHypeCycleForecast(technology) {
    const model = this.models.get('hypeCycle');
    
    // Analyze hype indicators
    const hypeIndicators = await this.getHypeIndicators(technology._id);
    
    // Classify hype cycle phase
    const forecast = {
      type: 'hype_cycle',
      model: model.name,
      confidence: this.calculateHypeConfidence(hypeIndicators),
      currentPhase: this.classifyHypePhase(hypeIndicators, model.parameters),
      projections: this.generateHypeProjections(hypeIndicators),
      indicators: hypeIndicators
    };

    return forecast;
  }

  // Helper methods for calculations
  calculatePatentGrowth(patents) {
    if (patents.length < 2) return 0;
    
    const recentPatents = patents.filter(p => 
      new Date(p.filingDate) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    );
    
    const olderPatents = patents.filter(p => 
      new Date(p.filingDate) <= new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    );
    
    return recentPatents.length / Math.max(olderPatents.length, 1);
  }

  async calculatePublicationGrowth(technologyId) {
    // Implementation for publication growth calculation
    return 1.2; // Placeholder
  }

  async calculateMarketIndicators(technologyId) {
    // Implementation for market indicators calculation
    return {
      investment: 0.8,
      adoption: 0.6,
      competition: 0.7
    };
  }

  calculateConfidence(patentGrowth, publicationGrowth, marketIndicators) {
    // Calculate confidence based on data quality and consistency
    const dataQuality = (patentGrowth + publicationGrowth + marketIndicators.investment) / 3;
    return Math.min(Math.max(dataQuality, 0.1), 0.95);
  }

  generateTRLProjections(currentTRL, patentGrowth, publicationGrowth, marketIndicators) {
    const projections = [];
    const baseProgression = (patentGrowth + publicationGrowth + marketIndicators.investment) / 3;
    
    for (let year = 1; year <= 5; year++) {
      const progression = Math.min(currentTRL + (baseProgression * year * 0.5), 9);
      projections.push({
        year: new Date().getFullYear() + year,
        trl: Math.round(progression * 10) / 10,
        confidence: Math.max(0.5 - (year * 0.1), 0.2)
      });
    }
    
    return projections;
  }

  generateMarketProjections(marketData, adoptionData, parameters) {
    // S-curve market size projections
    const projections = [];
    const currentSize = marketData.currentSize || 1000000;
    const saturationSize = currentSize * 10;
    
    for (let year = 1; year <= parameters.timeHorizon; year++) {
      const adoptionRate = parameters.adoptionRate * (1 + year * 0.1);
      const size = saturationSize * (1 - Math.exp(-adoptionRate * year));
      
      projections.push({
        year: new Date().getFullYear() + year,
        size: Math.round(size),
        growth: Math.round(((size - currentSize) / currentSize) * 100),
        confidence: Math.max(0.6 - (year * 0.1), 0.3)
      });
    }
    
    return projections;
  }

  generateAdoptionProjections(adoptionIndicators, parameters) {
    const projections = [];
    
    for (let year = 1; year <= 5; year++) {
      const adoption = parameters.marketPotential * 
        (1 - Math.exp(-(parameters.innovationCoefficient + parameters.imitationCoefficient) * year));
      
      projections.push({
        year: new Date().getFullYear() + year,
        adoption: Math.round(adoption),
        rate: Math.round((adoption / parameters.marketPotential) * 100),
        confidence: Math.max(0.7 - (year * 0.1), 0.4)
      });
    }
    
    return projections;
  }

  classifyHypePhase(hypeIndicators, parameters) {
    const hypeScore = (hypeIndicators.mediaMentions + hypeIndicators.investment + hypeIndicators.patents) / 3;
    
    if (hypeScore > parameters.peakThreshold) return 'Peak of Inflated Expectations';
    if (hypeScore < parameters.troughThreshold) return 'Trough of Disillusionment';
    if (hypeScore > parameters.plateauThreshold) return 'Plateau of Productivity';
    return 'Slope of Enlightenment';
  }

  generateHypeProjections(hypeIndicators) {
    return {
      currentPhase: this.classifyHypePhase(hypeIndicators, this.models.get('hypeCycle').parameters),
      nextPhase: 'Plateau of Productivity',
      estimatedTransition: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async saveForecasts(technologyId, forecasts) {
    try {
      for (const forecast of forecasts) {
        const forecastDoc = new ForecastModel({
          technologyId,
          forecastType: forecast.type,
          forecastData: forecast,
          forecastDate: new Date(),
          timeHorizonYears: 5,
          modelUsed: forecast.model,
          confidenceScore: forecast.confidence
        });
        
        await forecastDoc.save();
      }
    } catch (error) {
      logger.error('Failed to save forecasts:', error);
    }
  }

  async getHistoricalTRL(technologyId) {
    // Implementation to get historical TRL data
    return [];
  }

  async getMarketData(technologyId) {
    // Implementation to get market data
    return { currentSize: 1000000 };
  }

  async getAdoptionData(technologyId) {
    // Implementation to get adoption data
    return {};
  }

  async getAdoptionIndicators(technologyId) {
    // Implementation to get adoption indicators
    return {};
  }

  async getHypeIndicators(technologyId) {
    // Implementation to get hype indicators
    return {
      mediaMentions: 0.7,
      investment: 0.8,
      patents: 0.6
    };
  }

  calculateMarketConfidence(marketData, adoptionData) {
    return 0.75; // Placeholder
  }

  calculateAdoptionConfidence(adoptionIndicators) {
    return 0.70; // Placeholder
  }

  calculateHypeConfidence(hypeIndicators) {
    return 0.65; // Placeholder
  }

  async stop() {
    if (this.forecastingInterval) {
      clearInterval(this.forecastingInterval);
      this.forecastingInterval = null;
    }
    
    this.isInitialized = false;
    logger.info('🛑 Forecasting engine stopped');
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      models: Array.from(this.models.keys()),
      lastForecast: null // Would track last forecast time
    };
  }
}

// Create singleton instance
const forecastingEngine = new ForecastingEngine();

export const initializeForecastingEngine = async () => {
  await forecastingEngine.initialize();
  return forecastingEngine;
};

export default forecastingEngine;
