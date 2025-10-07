import axios from 'axios';
import cron from 'node-cron';
import { logger } from '../utils/logger.js';
import PatentService from './patentService.js';
import PublicationService from './publicationService.js';
import CompanyService from './companyService.js';
import MarketDataService from './marketDataService.js';

class DataAggregationService {
  constructor() {
    this.isRunning = false;
    this.lastRun = null;
    this.scheduledJobs = new Map();
    this.dataSources = new Map();
    
    // Initialize data sources
    this.initializeDataSources();
  }

  initializeDataSources() {
    // Patent databases
    this.dataSources.set('uspto', {
      name: 'US Patent and Trademark Office',
      type: 'patent',
      url: 'https://developer.uspto.gov/ibd-api/v1/patent/application',
      enabled: true,
      frequency: 'daily',
      lastSync: null
    });

    this.dataSources.set('epo', {
      name: 'European Patent Office',
      type: 'patent',
      url: 'https://developers.epo.org/',
      enabled: true,
      frequency: 'daily',
      lastSync: null
    });

    this.dataSources.set('wipo', {
      name: 'World Intellectual Property Organization',
      type: 'patent',
      url: 'https://www.wipo.int/patentscope/en/',
      enabled: true,
      frequency: 'daily',
      lastSync: null
    });

    // Publication databases
    this.dataSources.set('arxiv', {
      name: 'arXiv',
      type: 'publication',
      url: 'http://export.arxiv.org/api/query',
      enabled: true,
      frequency: 'daily',
      lastSync: null
    });

    this.dataSources.set('pubmed', {
      name: 'PubMed',
      type: 'publication',
      url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/',
      enabled: true,
      frequency: 'daily',
      lastSync: null
    });

    this.dataSources.set('ieee', {
      name: 'IEEE Xplore',
      type: 'publication',
      url: 'https://ieeexploreapi.ieee.org/api/v1/',
      enabled: true,
      frequency: 'daily',
      lastSync: null
    });

    // Market data sources
    this.dataSources.set('bloomberg', {
      name: 'Bloomberg Terminal',
      type: 'market',
      url: 'https://api.bloomberg.com/',
      enabled: false, // Requires subscription
      frequency: 'daily',
      lastSync: null
    });

    this.dataSources.set('crunchbase', {
      name: 'Crunchbase',
      type: 'company',
      url: 'https://api.crunchbase.com/v4/',
      enabled: false, // Requires API key
      frequency: 'daily',
      lastSync: null
    });
  }

  async start() {
    if (this.isRunning) {
      logger.warn('Data aggregation service is already running');
      return;
    }

    this.isRunning = true;
    logger.info('🚀 Starting Data Aggregation Service');

    // Schedule different types of data collection
    this.schedulePatentCollection();
    this.schedulePublicationCollection();
    this.scheduleCompanyDataCollection();
    this.scheduleMarketDataCollection();
    this.scheduleAnalysisTasks();

    // Run initial data collection
    await this.runInitialCollection();
  }

  schedulePatentCollection() {
    // Run patent collection daily at 2 AM
    const job = cron.schedule('0 2 * * *', async () => {
      logger.info('🔄 Starting scheduled patent data collection');
      await this.collectPatentData();
    }, {
      scheduled: false,
      timezone: 'Asia/Kolkata'
    });

    this.scheduledJobs.set('patentCollection', job);
    job.start();
    logger.info('📅 Scheduled patent collection: Daily at 2:00 AM IST');
  }

  schedulePublicationCollection() {
    // Run publication collection daily at 3 AM
    const job = cron.schedule('0 3 * * *', async () => {
      logger.info('🔄 Starting scheduled publication data collection');
      await this.collectPublicationData();
    }, {
      scheduled: false,
      timezone: 'Asia/Kolkata'
    });

    this.scheduledJobs.set('publicationCollection', job);
    job.start();
    logger.info('📅 Scheduled publication collection: Daily at 3:00 AM IST');
  }

  scheduleCompanyDataCollection() {
    // Run company data collection weekly on Sundays at 4 AM
    const job = cron.schedule('0 4 * * 0', async () => {
      logger.info('🔄 Starting scheduled company data collection');
      await this.collectCompanyData();
    }, {
      scheduled: false,
      timezone: 'Asia/Kolkata'
    });

    this.scheduledJobs.set('companyCollection', job);
    job.start();
    logger.info('📅 Scheduled company collection: Weekly on Sundays at 4:00 AM IST');
  }

  scheduleMarketDataCollection() {
    // Run market data collection daily at 5 AM
    const job = cron.schedule('0 5 * * *', async () => {
      logger.info('🔄 Starting scheduled market data collection');
      await this.collectMarketData();
    }, {
      scheduled: false,
      timezone: 'Asia/Kolkata'
    });

    this.scheduledJobs.set('marketCollection', job);
    job.start();
    logger.info('📅 Scheduled market data collection: Daily at 5:00 AM IST');
  }

  scheduleAnalysisTasks() {
    // Run analysis tasks daily at 6 AM
    const job = cron.schedule('0 6 * * *', async () => {
      logger.info('🔄 Starting scheduled analysis tasks');
      await this.runAnalysisTasks();
    }, {
      scheduled: false,
      timezone: 'Asia/Kolkata'
    });

    this.scheduledJobs.set('analysisTasks', job);
    job.start();
    logger.info('📅 Scheduled analysis tasks: Daily at 6:00 AM IST');
  }

  async runInitialCollection() {
    logger.info('🔄 Running initial data collection...');
    
    try {
      await Promise.all([
        this.collectPatentData(),
        this.collectPublicationData(),
        this.collectCompanyData(),
        this.collectMarketData()
      ]);
      
      this.lastRun = new Date();
      logger.info('✅ Initial data collection completed');
    } catch (error) {
      logger.error('❌ Initial data collection failed:', error);
    }
  }

  async collectPatentData() {
    const startTime = Date.now();
    logger.info('🔍 Collecting patent data...');

    try {
      const patentService = new PatentService();
      
      // Collect from multiple sources
      const results = await Promise.allSettled([
        patentService.collectFromUSPTO(),
        patentService.collectFromEPO(),
        patentService.collectFromWIPO(),
        patentService.collectFromIndianPatentOffice()
      ]);

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info(`📊 Patent collection completed: ${successful} successful, ${failed} failed`);
      logger.info(`⏱️  Time taken: ${Date.now() - startTime}ms`);

      // Update data source status
      this.updateDataSourceStatus('uspto', true);
      this.updateDataSourceStatus('epo', true);
      this.updateDataSourceStatus('wipo', true);

    } catch (error) {
      logger.error('❌ Patent data collection failed:', error);
      throw error;
    }
  }

  async collectPublicationData() {
    const startTime = Date.now();
    logger.info('📚 Collecting publication data...');

    try {
      const publicationService = new PublicationService();
      
      const results = await Promise.allSettled([
        publicationService.collectFromArXiv(),
        publicationService.collectFromPubMed(),
        publicationService.collectFromIEEE(),
        publicationService.collectFromGoogleScholar()
      ]);

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info(`📊 Publication collection completed: ${successful} successful, ${failed} failed`);
      logger.info(`⏱️  Time taken: ${Date.now() - startTime}ms`);

      // Update data source status
      this.updateDataSourceStatus('arxiv', true);
      this.updateDataSourceStatus('pubmed', true);
      this.updateDataSourceStatus('ieee', true);

    } catch (error) {
      logger.error('❌ Publication data collection failed:', error);
      throw error;
    }
  }

  async collectCompanyData() {
    const startTime = Date.now();
    logger.info('🏢 Collecting company data...');

    try {
      const companyService = new CompanyService();
      
      const results = await Promise.allSettled([
        companyService.collectFromCrunchbase(),
        companyService.collectFromLinkedIn(),
        companyService.collectFromCompanyWebsites(),
        companyService.collectFromGovernmentDatabases()
      ]);

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info(`📊 Company data collection completed: ${successful} successful, ${failed} failed`);
      logger.info(`⏱️  Time taken: ${Date.now() - startTime}ms`);

    } catch (error) {
      logger.error('❌ Company data collection failed:', error);
      throw error;
    }
  }

  async collectMarketData() {
    const startTime = Date.now();
    logger.info('📈 Collecting market data...');

    try {
      const marketDataService = new MarketDataService();
      
      const results = await Promise.allSettled([
        marketDataService.collectMarketReports(),
        marketDataService.collectFundingData(),
        marketDataService.collectInvestmentData(),
        marketDataService.collectIndustryReports()
      ]);

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info(`📊 Market data collection completed: ${successful} successful, ${failed} failed`);
      logger.info(`⏱️  Time taken: ${Date.now() - startTime}ms`);

    } catch (error) {
      logger.error('❌ Market data collection failed:', error);
      throw error;
    }
  }

  async runAnalysisTasks() {
    logger.info('🧠 Running analysis tasks...');

    try {
      // Run various analysis tasks
      await Promise.allSettled([
        this.runTrendAnalysis(),
        this.runTechnologyConvergenceAnalysis(),
        this.runSignalDetection(),
        this.runCompetitiveAnalysis(),
        this.updateTechnologyReadinessLevels()
      ]);

      logger.info('✅ Analysis tasks completed');

    } catch (error) {
      logger.error('❌ Analysis tasks failed:', error);
    }
  }

  async runTrendAnalysis() {
    logger.info('📊 Running trend analysis...');
    // Implementation for trend analysis
  }

  async runTechnologyConvergenceAnalysis() {
    logger.info('🔗 Running technology convergence analysis...');
    // Implementation for convergence analysis
  }

  async runSignalDetection() {
    logger.info('📡 Running signal detection...');
    // Implementation for signal detection
  }

  async runCompetitiveAnalysis() {
    logger.info('⚔️ Running competitive analysis...');
    // Implementation for competitive analysis
  }

  async updateTechnologyReadinessLevels() {
    logger.info('📈 Updating technology readiness levels...');
    // Implementation for TRL updates
  }

  updateDataSourceStatus(sourceId, success) {
    const source = this.dataSources.get(sourceId);
    if (source) {
      source.lastSync = new Date();
      source.status = success ? 'success' : 'error';
    }
  }

  getDataSourceStatus() {
    const status = {};
    for (const [id, source] of this.dataSources) {
      status[id] = {
        name: source.name,
        type: source.type,
        enabled: source.enabled,
        lastSync: source.lastSync,
        status: source.status || 'unknown'
      };
    }
    return status;
  }

  async stop() {
    if (!this.isRunning) {
      logger.warn('Data aggregation service is not running');
      return;
    }

    logger.info('🛑 Stopping Data Aggregation Service');

    // Stop all scheduled jobs
    for (const [name, job] of this.scheduledJobs) {
      job.stop();
      logger.info(`⏹️  Stopped job: ${name}`);
    }

    this.scheduledJobs.clear();
    this.isRunning = false;
    logger.info('✅ Data Aggregation Service stopped');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      activeJobs: Array.from(this.scheduledJobs.keys()),
      dataSources: this.getDataSourceStatus()
    };
  }
}

// Create singleton instance
const dataAggregationService = new DataAggregationService();

export const initializeDataAggregation = async () => {
  await dataAggregationService.start();
  return dataAggregationService;
};

export default dataAggregationService;
