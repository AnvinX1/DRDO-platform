#!/usr/bin/env node

/**
 * Technology Intelligence Platform Setup Script
 * SIH 2024 - Problem Statement 25245
 * Ministry of Defence (MoD)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  try {
    log(`\n${colors.cyan}${description}...${colors.reset}`);
    execSync(command, { stdio: 'inherit' });
    log(`${colors.green}✓ ${description} completed${colors.reset}`);
  } catch (error) {
    log(`${colors.red}✗ ${description} failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

function createDirectories() {
  const dirs = [
    'src/types',
    'src/hooks',
    'src/constants',
    'src/styles',
    'scripts',
    'tests',
    'docs',
    'public/images'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`Created directory: ${dir}`, 'green');
    }
  });
}

function createConfigFiles() {
  // Create Prettier configuration
  const prettierConfig = {
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false
  };

  fs.writeFileSync('.prettierrc', JSON.stringify(prettierConfig, null, 2));
  log('Created .prettierrc', 'green');

  // Create Vitest configuration
  const vitestConfig = `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  }
});`;

  fs.writeFileSync('vitest.config.ts', vitestConfig);
  log('Created vitest.config.ts', 'green');

  // Create test setup file
  const testSetup = `import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
`;

  fs.writeFileSync('tests/setup.ts', testSetup);
  log('Created tests/setup.ts', 'green');
}

function createDocumentationFiles() {
  // Create API documentation template
  const apiDoc = `# API Documentation

## Technology Intelligence Platform API

### Base URL
\`http://localhost:5173/api\`

### Authentication
All API endpoints require authentication via JWT token.

### Endpoints

#### Technologies
- \`GET /technologies\` - List all technologies
- \`POST /technologies\` - Create new technology
- \`GET /technologies/:id\` - Get technology by ID
- \`PUT /technologies/:id\` - Update technology
- \`DELETE /technologies/:id\` - Delete technology

#### Patents
- \`GET /patents\` - List patents with filters
- \`GET /patents/:id\` - Get patent by ID
- \`POST /patents/search\` - Search patents
- \`GET /patents/trends\` - Get patent trends

#### Companies
- \`GET /companies\` - List companies
- \`GET /companies/:id\` - Get company by ID
- \`GET /companies/:id/technologies\` - Get company technologies
- \`GET /companies/investment\` - Get investment data

#### Forecasting
- \`POST /forecasts/generate\` - Generate forecasts
- \`GET /forecasts/:id\` - Get forecast by ID
- \`GET /forecasts/trl-progression\` - Get TRL progression
- \`GET /forecasts/market-size\` - Get market predictions

### Response Format
All API responses follow this format:

\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00Z"
}
\`\`\`

### Error Format
\`\`\`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
\`\`\`
`;

  fs.writeFileSync('docs/API.md', apiDoc);
  log('Created docs/API.md', 'green');

  // Create deployment guide
  const deploymentGuide = `# Deployment Guide

## Technology Intelligence Platform Deployment

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Production server (Ubuntu 20.04+ recommended)

### Production Deployment

#### 1. Server Setup
\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
\`\`\`

#### 2. Application Deployment
\`\`\`bash
# Clone repository
git clone <repository-url>
cd technology-intelligence-platform

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "tech-intel" -- start
pm2 save
pm2 startup
\`\`\`

#### 3. Nginx Configuration
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

#### 4. SSL Configuration
\`\`\`bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com
\`\`\`

### Environment Variables
Create \`.env.production\` file:
\`\`\`
NODE_ENV=production
PORT=5173
DATABASE_URL=sqlite:./production.db
JWT_SECRET=your-secret-key
API_BASE_URL=https://your-domain.com/api
\`\`\`

### Monitoring
- PM2 monitoring: \`pm2 monit\`
- Logs: \`pm2 logs tech-intel\`
- Restart: \`pm2 restart tech-intel\`

### Backup Strategy
\`\`\`bash
# Database backup
cp production.db backup-$(date +%Y%m%d).db

# Application backup
tar -czf app-backup-$(date +%Y%m%d).tar.gz .
\`\`\`
`;

  fs.writeFileSync('docs/DEPLOYMENT.md', deploymentGuide);
  log('Created docs/DEPLOYMENT.md', 'green');
}

function main() {
  log(`${colors.bright}${colors.cyan}
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    Technology Intelligence Platform Setup                    ║
║    SIH 2024 - Problem Statement 25245                       ║
║    Ministry of Defence (MoD)                                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  log('\n🚀 Starting setup process...', 'yellow');

  // Create necessary directories
  createDirectories();

  // Create configuration files
  createConfigFiles();

  // Create documentation files
  createDocumentationFiles();

  // Install dependencies
  execCommand('npm install', 'Installing dependencies');

  // Run type checking
  execCommand('npm run typecheck', 'Running TypeScript type checking');

  // Run linting
  execCommand('npm run lint', 'Running ESLint');

  // Format code
  execCommand('npm run format', 'Formatting code with Prettier');

  log(`\n${colors.bright}${colors.green}✅ Setup completed successfully!${colors.reset}`);
  
  log(`\n${colors.cyan}Next steps:${colors.reset}`);
  log('1. Run `npm run dev` to start development server', 'yellow');
  log('2. Open http://localhost:5173 in your browser', 'yellow');
  log('3. Run `npm run test` to run tests', 'yellow');
  log('4. Run `npm run build` to build for production', 'yellow');
  
  log(`\n${colors.cyan}Documentation:${colors.reset}`);
  log('- README.md - Project overview and setup', 'yellow');
  log('- PROJECT_DOCUMENTATION.md - Technical documentation', 'yellow');
  log('- SIH_SUBMISSION_GUIDE.md - Submission requirements', 'yellow');
  log('- docs/API.md - API documentation', 'yellow');
  log('- docs/DEPLOYMENT.md - Deployment guide', 'yellow');

  log(`\n${colors.bright}${colors.magenta}Good luck with your SIH 2024 submission! 🎉${colors.reset}\n`);
}

main();
