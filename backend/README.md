# Technology Intelligence Platform - Backend

## Overview

This is the backend API for the DRDO Technology Intelligence and Forecasting Platform. It provides automated data aggregation, AI-powered forecasting, and comprehensive analytics for technology intelligence.

## Features

### 🔍 **Automated Data Aggregation**
- **Patent Data**: USPTO, EPO, WIPO, Indian Patent Office
- **Publications**: arXiv, PubMed, IEEE Xplore, Google Scholar
- **Company Intelligence**: Crunchbase, LinkedIn, Government databases
- **Market Data**: Industry reports, funding data, investment tracking

### 🧠 **AI-Powered Forecasting**
- **TRL Progression**: Technology Readiness Level forecasting
- **Market Size**: S-curve analysis and market growth prediction
- **Adoption Rate**: Bass diffusion model for technology adoption
- **Hype Cycle**: Gartner-style hype cycle classification
- **Convergence Detection**: Technology convergence identification

### 📊 **Comprehensive Analytics**
- **Trend Analysis**: Technology trend identification
- **Signal Detection**: Early warning system for emerging technologies
- **Competitive Analysis**: Competitive landscape mapping
- **Risk Assessment**: Technology risk evaluation

### 🔄 **Real-time Monitoring**
- **Continuous Data Collection**: Automated data ingestion
- **Alert System**: Real-time notifications for critical changes
- **Dashboard Updates**: Live dashboard data updates
- **Performance Monitoring**: System health and performance tracking

## Architecture

```
backend/
├── src/
│   ├── config/          # Database and configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── logs/                # Application logs
├── package.json         # Dependencies
└── README.md           # This file
```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Install MongoDB locally or use MongoDB Atlas
   # Update MONGODB_URI in .env
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Technologies
- `GET /api/technologies` - Get all technologies
- `GET /api/technologies/:id` - Get single technology
- `POST /api/technologies` - Create technology
- `PUT /api/technologies/:id` - Update technology
- `DELETE /api/technologies/:id` - Delete technology
- `GET /api/technologies/stats/overview` - Get technology statistics

### Patents
- `GET /api/patents` - Get all patents
- `GET /api/patents/stats` - Get patent statistics

### Forecasting
- `GET /api/forecasting/:technologyId` - Get forecasts for technology

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics

### Data Sources
- `GET /api/data-sources/status` - Get data source status

## Data Models

### Technology
- Basic information (name, description, domain)
- TRL tracking and progression
- Keywords and categorization
- AI-generated insights
- Metadata and quality scores

### Patent
- Patent details (number, title, abstract)
- Filing and publication dates
- Assignee and inventor information
- Classification codes
- Citation analysis
- AI analysis results

### Forecast
- Forecast type and methodology
- Projections and confidence scores
- Model information
- Time horizon and validity

## Services

### Data Aggregation Service
- Automated data collection from multiple sources
- Scheduled data ingestion
- Data quality assessment
- Source status monitoring

### Forecasting Engine
- Multiple forecasting models
- AI-powered predictions
- Confidence scoring
- Model performance tracking

### Monitoring System
- Real-time system monitoring
- Alert management
- Performance metrics
- Health checks

## Configuration

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port
- `MONGODB_URI`: Database connection string
- `API_KEYS`: External service API keys
- `CRON_SCHEDULES`: Data collection schedules

### Data Collection Schedules
- **Patents**: Daily at 2:00 AM IST
- **Publications**: Daily at 3:00 AM IST
- **Companies**: Weekly on Sundays at 4:00 AM IST
- **Market Data**: Daily at 5:00 AM IST
- **Analysis**: Daily at 6:00 AM IST

## Development

### Running Tests
```bash
npm test
```

### Code Quality
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

## Deployment

### Docker
```bash
docker build -t tech-intelligence-backend .
docker run -p 3000:3000 tech-intelligence-backend
```

### PM2
```bash
npm install -g pm2
pm2 start src/server.js --name tech-intelligence-api
```

## Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Logs
- Application logs: `logs/combined.log`
- Error logs: `logs/error.log`
- Console output with timestamps

## Security

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Request validation
- **Error Handling**: Secure error responses

## Performance

- **Compression**: Response compression
- **Caching**: Strategic caching implementation
- **Database Indexing**: Optimized database queries
- **Connection Pooling**: Database connection management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the DRDO Technology Intelligence Team.
