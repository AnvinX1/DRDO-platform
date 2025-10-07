import { db } from '../lib/database';

export async function insertSampleData() {
  try {
    const technologies = [
      {
        name: 'BrahMos Hypersonic Cruise Missile',
        description: 'Indo-Russian supersonic cruise missile system with hypersonic variants under development.',
        domain: 'Defense & Aerospace',
        subdomain: 'Advanced Weapons',
        current_trl: 8,
        keywords: ['brahmos', 'hypersonic', 'cruise missile', 'defense', 'india'],
        status: 'mature' as const,
      },
      {
        name: 'Tejas Light Combat Aircraft',
        description: 'Indigenously developed multi-role fighter aircraft with advanced avionics and weapons systems.',
        domain: 'Defense & Aerospace',
        subdomain: 'Military Aircraft',
        current_trl: 9,
        keywords: ['tejas', 'lca', 'fighter aircraft', 'hal', 'indigenous'],
        status: 'mature' as const,
      },
      {
        name: 'Chandrayaan Lunar Exploration',
        description: 'ISRO\'s lunar exploration program with successful soft landing and rover deployment.',
        domain: 'Space Technology',
        subdomain: 'Lunar Exploration',
        current_trl: 9,
        keywords: ['chandrayaan', 'isro', 'lunar', 'moon', 'space'],
        status: 'mature' as const,
      },
      {
        name: 'Aadhaar Biometric System',
        description: 'World\'s largest biometric identification system with 1.3+ billion enrolled users.',
        domain: 'Digital Technology',
        subdomain: 'Biometric Systems',
        current_trl: 9,
        keywords: ['aadhaar', 'biometric', 'uidai', 'digital identity', 'india'],
        status: 'mature' as const,
      },
      {
        name: 'UPI Digital Payments',
        description: 'Unified Payments Interface enabling instant real-time payments across India.',
        domain: 'Financial Technology',
        subdomain: 'Digital Payments',
        current_trl: 9,
        keywords: ['upi', 'digital payments', 'fintech', 'npci', 'instant payments'],
        status: 'mature' as const,
      },
      {
        name: 'Quantum Key Distribution',
        description: 'DRDO\'s quantum communication technology for secure military communications.',
        domain: 'Quantum Technology',
        subdomain: 'Quantum Communication',
        current_trl: 6,
        keywords: ['quantum', 'qkd', 'drdo', 'secure communication', 'encryption'],
        status: 'developing' as const,
      },
      {
        name: 'Agni-V Intercontinental Ballistic Missile',
        description: 'India\'s most advanced ICBM with range exceeding 5000km and MIRV capability.',
        domain: 'Defense & Aerospace',
        subdomain: 'Strategic Weapons',
        current_trl: 8,
        keywords: ['agni', 'icbm', 'ballistic missile', 'strategic', 'nuclear'],
        status: 'mature' as const,
      },
      {
        name: 'Gaganyaan Human Spaceflight',
        description: 'ISRO\'s ambitious human spaceflight program to send Indian astronauts to space.',
        domain: 'Space Technology',
        subdomain: 'Human Spaceflight',
        current_trl: 7,
        keywords: ['gaganyaan', 'human spaceflight', 'isro', 'astronauts', 'space'],
        status: 'developing' as const,
      },
    ];

    // Insert technologies one by one and collect the results
    const techData = [];
    for (const tech of technologies) {
      const result = await db.insertTechnology({
        id: crypto.randomUUID(),
        ...tech
      });
      if (result.changes > 0) {
        // Get the inserted technology to get the ID
        const insertedTechs = await db.getTechnologies();
          const insertedTech = insertedTechs.find((t: any) => t.name === tech.name);
        if (insertedTech) {
          techData.push(insertedTech);
        }
      }
    }
    console.log('Technologies inserted:', techData);

    if (techData && techData.length > 0) {
      const patents = [
        {
          technology_id: techData[0].id,
          patent_number: 'IN202147012345',
          title: 'Advanced Ramjet-Scramjet Combined Cycle Engine for Hypersonic Vehicles',
          abstract: 'A novel combined cycle propulsion system integrating ramjet and scramjet technologies for sustained hypersonic flight.',
          filing_date: '2021-03-15',
          publication_date: '2022-09-25',
          grant_date: '2023-11-10',
          country_code: 'IN',
          assignee: 'Defence Research and Development Organisation',
          inventors: ['Dr. Rajesh Kumar', 'Dr. Priya Sharma', 'Dr. Amit Patel'],
          classification_codes: ['F02K7/16', 'B64D27/20'],
          citation_count: 45,
          legal_status: 'granted' as const,
          url: 'https://ipindia.gov.in/patent-details/IN202147012345',
        },
        {
          technology_id: techData[1].id,
          patent_number: 'IN202045067890',
          title: 'Advanced Fly-by-Wire Control System for Light Combat Aircraft',
          abstract: 'An integrated fly-by-wire control system with enhanced stability and maneuverability for Tejas LCA.',
          filing_date: '2020-08-20',
          publication_date: '2021-12-15',
          grant_date: '2023-03-20',
          country_code: 'IN',
          assignee: 'Hindustan Aeronautics Limited',
          inventors: ['Dr. Suresh Reddy', 'Dr. Meera Iyer', 'Dr. Vikram Singh'],
          classification_codes: ['B64C13/50', 'G05D1/00'],
          citation_count: 38,
          legal_status: 'granted' as const,
          url: 'https://ipindia.gov.in/patent-details/IN202045067890',
        },
        {
          technology_id: techData[2].id,
          patent_number: 'IN202247023456',
          title: 'Lunar Landing System with Terrain Relative Navigation',
          abstract: 'An autonomous landing system for lunar missions with advanced terrain recognition and hazard avoidance.',
          filing_date: '2022-06-10',
          publication_date: '2023-08-20',
          grant_date: '2023-10-15',
          country_code: 'IN',
          assignee: 'Indian Space Research Organisation',
          inventors: ['Dr. Anil Kumar', 'Dr. Sunita Rao', 'Dr. Rajesh Gupta'],
          classification_codes: ['B64G1/24', 'G01C21/20'],
          citation_count: 67,
          legal_status: 'granted' as const,
          url: 'https://ipindia.gov.in/patent-details/IN202247023456',
        },
        {
          technology_id: techData[3].id,
          patent_number: 'IN201845034567',
          title: 'Multi-Modal Biometric Authentication System',
          abstract: 'A comprehensive biometric system integrating fingerprint, iris, and facial recognition for Aadhaar authentication.',
          filing_date: '2018-12-05',
          publication_date: '2020-06-15',
          grant_date: '2022-01-30',
          country_code: 'IN',
          assignee: 'Unique Identification Authority of India',
          inventors: ['Dr. Nandan Nilekani', 'Dr. R.S. Sharma', 'Dr. Ajay Bhushan Pandey'],
          classification_codes: ['G06F21/32', 'G06V40/13'],
          citation_count: 89,
          legal_status: 'granted' as const,
          url: 'https://ipindia.gov.in/patent-details/IN201845034567',
        },
        {
          technology_id: techData[4].id,
          patent_number: 'IN201945045678',
          title: 'Real-Time Payment Processing System with Instant Settlement',
          abstract: 'A distributed payment processing system enabling instant real-time money transfers across multiple banks.',
          filing_date: '2019-04-15',
          publication_date: '2020-10-25',
          grant_date: '2022-05-15',
          country_code: 'IN',
          assignee: 'National Payments Corporation of India',
          inventors: ['Dr. Dilip Asbe', 'Dr. Praveena Rai', 'Dr. Arif Khan'],
          classification_codes: ['G06Q20/10', 'G06Q20/22'],
          citation_count: 156,
          legal_status: 'granted' as const,
          url: 'https://ipindia.gov.in/patent-details/IN201945045678',
        },
      ];

      await db.insertPatents(patents.map(patent => ({
        id: crypto.randomUUID(),
        ...patent
      })));

      const publications = [
        {
          technology_id: techData[0].id,
          title: 'Development of Hypersonic Cruise Missile Technology in India: BrahMos and Beyond',
          abstract: 'This paper presents the evolution of hypersonic missile technology in India, focusing on BrahMos development and future hypersonic capabilities.',
          authors: ['Dr. Rajesh Kumar', 'Dr. Priya Sharma', 'Dr. Amit Patel'],
          publication_date: '2023-09-15',
          source: 'Defence Science Journal',
          doi: '10.14429/dsj.73.3.12345',
          citation_count: 89,
          keywords: ['brahmos', 'hypersonic', 'missile technology', 'india'],
          relevance_score: 0.95,
          url: 'https://publications.drdo.gov.in/ojs/index.php/dsj/article/view/12345',
        },
        {
          technology_id: techData[1].id,
          title: 'Tejas LCA: Indigenous Development of Advanced Fighter Aircraft',
          abstract: 'Comprehensive analysis of Tejas Light Combat Aircraft development, challenges overcome, and technological achievements.',
          authors: ['Dr. Suresh Reddy', 'Dr. Meera Iyer', 'Dr. Vikram Singh'],
          publication_date: '2023-11-20',
          source: 'Aerospace India',
          doi: '10.1016/j.aerospace.2023.11.045',
          citation_count: 156,
          keywords: ['tejas', 'lca', 'fighter aircraft', 'indigenous development'],
          relevance_score: 0.92,
          url: 'https://aerospaceindia.org/articles/tejas-lca-development',
        },
        {
          technology_id: techData[2].id,
          title: 'Chandrayaan-3: India\'s Successful Lunar Landing Mission',
          abstract: 'Detailed analysis of Chandrayaan-3 mission, landing technology, and scientific achievements on the lunar surface.',
          authors: ['Dr. Anil Kumar', 'Dr. Sunita Rao', 'Dr. Rajesh Gupta'],
          publication_date: '2023-12-10',
          source: 'Current Science',
          doi: '10.18520/cs/v125/i12/1234-1245',
          citation_count: 234,
          keywords: ['chandrayaan', 'lunar landing', 'isro', 'moon mission'],
          relevance_score: 0.98,
          url: 'https://www.currentscience.ac.in/Volumes/125/12/1234.pdf',
        },
        {
          technology_id: techData[3].id,
          title: 'Aadhaar: World\'s Largest Biometric Identity System - Technology and Impact',
          abstract: 'Analysis of Aadhaar system architecture, biometric technologies used, and its transformative impact on Indian society.',
          authors: ['Dr. Nandan Nilekani', 'Dr. R.S. Sharma'],
          publication_date: '2023-10-05',
          source: 'IEEE Computer',
          doi: '10.1109/MC.2023.1234567',
          citation_count: 178,
          keywords: ['aadhaar', 'biometric', 'digital identity', 'uidai'],
          relevance_score: 0.94,
          url: 'https://ieeexplore.ieee.org/document/1234567',
        },
        {
          technology_id: techData[4].id,
          title: 'UPI: Revolutionizing Digital Payments in India',
          abstract: 'Comprehensive study of UPI architecture, transaction processing, and its role in India\'s digital payment revolution.',
          authors: ['Dr. Dilip Asbe', 'Dr. Praveena Rai'],
          publication_date: '2023-08-15',
          source: 'Journal of Digital Banking',
          doi: '10.1108/JDB-2023-001234',
          citation_count: 145,
          keywords: ['upi', 'digital payments', 'fintech', 'npci'],
          relevance_score: 0.91,
          url: 'https://www.emerald.com/insight/content/doi/10.1108/JDB-2023-001234',
        },
      ];

      await db.insertPublications(publications.map(publication => ({
        id: crypto.randomUUID(),
        ...publication
      })));

      const companies = [
        {
          name: 'Defence Research and Development Organisation (DRDO)',
          description: 'India\'s premier defense research organization developing cutting-edge military technologies.',
          country: 'India',
          founded_year: 1958,
          employee_count: 30000,
          company_type: 'public_sector' as const,
          website: 'https://www.drdo.gov.in',
        },
        {
          name: 'Hindustan Aeronautics Limited (HAL)',
          description: 'India\'s leading aerospace and defense company, manufacturer of Tejas LCA and other aircraft.',
          country: 'India',
          founded_year: 1940,
          employee_count: 25000,
          company_type: 'public_sector' as const,
          website: 'https://www.hal-india.co.in',
        },
        {
          name: 'Indian Space Research Organisation (ISRO)',
          description: 'India\'s national space agency responsible for space research and exploration missions.',
          country: 'India',
          founded_year: 1969,
          employee_count: 17000,
          company_type: 'public_sector' as const,
          website: 'https://www.isro.gov.in',
        },
        {
          name: 'Unique Identification Authority of India (UIDAI)',
          description: 'Government agency managing the world\'s largest biometric identity system - Aadhaar.',
          country: 'India',
          founded_year: 2009,
          employee_count: 5000,
          company_type: 'public_sector' as const,
          website: 'https://www.uidai.gov.in',
        },
        {
          name: 'National Payments Corporation of India (NPCI)',
          description: 'Umbrella organization for operating retail payments and settlement systems in India.',
          country: 'India',
          founded_year: 2008,
          employee_count: 2000,
          company_type: 'public_sector' as const,
          website: 'https://www.npci.org.in',
        },
        {
          name: 'Bharat Electronics Limited (BEL)',
          description: 'Leading defense electronics company manufacturing radars, communication systems, and electronic warfare equipment.',
          country: 'India',
          founded_year: 1954,
          employee_count: 15000,
          company_type: 'public_sector' as const,
          website: 'https://www.bel-india.in',
        },
        {
          name: 'Bharat Dynamics Limited (BDL)',
          description: 'Premier missile manufacturing company producing BrahMos, Akash, and other missile systems.',
          country: 'India',
          founded_year: 1970,
          employee_count: 8000,
          company_type: 'public_sector' as const,
          website: 'https://www.bdl-india.in',
        },
        {
          name: 'Reliance Jio',
          description: 'Leading telecommunications company driving India\'s digital transformation with 5G and IoT technologies.',
          country: 'India',
          founded_year: 2016,
          employee_count: 50000,
          company_type: 'large_enterprise' as const,
          website: 'https://www.jio.com',
        },
      ];

      // Insert companies one by one and collect the results
      const companyData = [];
      for (const company of companies) {
        const result = await db.insertCompanies([{
          id: crypto.randomUUID(),
          ...company
        }]);
        if (result.changes > 0) {
          // Get the inserted company to get the ID
          const insertedCompanies = await db.getCompanies();
          const insertedCompany = insertedCompanies.find((c: any) => c.name === company.name);
          if (insertedCompany) {
            companyData.push(insertedCompany);
          }
        }
      }

      if (companyData && companyData.length > 0) {
        const companyTech = [
          {
            company_id: companyData[0].id, // DRDO
            technology_id: techData[0].id, // BrahMos
            involvement_type: 'developing' as const,
            rd_investment_amount: 1200000000,
            government_funding_amount: 1200000000,
            private_funding_amount: 0,
            investment_year: 2023,
          },
          {
            company_id: companyData[1].id, // HAL
            technology_id: techData[1].id, // Tejas
            involvement_type: 'developing' as const,
            rd_investment_amount: 800000000,
            government_funding_amount: 600000000,
            private_funding_amount: 200000000,
            investment_year: 2023,
          },
          {
            company_id: companyData[2].id, // ISRO
            technology_id: techData[2].id, // Chandrayaan
            involvement_type: 'researching' as const,
            rd_investment_amount: 1500000000,
            government_funding_amount: 1500000000,
            private_funding_amount: 0,
            investment_year: 2023,
          },
          {
            company_id: companyData[3].id, // UIDAI
            technology_id: techData[3].id, // Aadhaar
            involvement_type: 'commercializing' as const,
            rd_investment_amount: 300000000,
            government_funding_amount: 300000000,
            private_funding_amount: 0,
            investment_year: 2023,
          },
          {
            company_id: companyData[4].id, // NPCI
            technology_id: techData[4].id, // UPI
            involvement_type: 'commercializing' as const,
            rd_investment_amount: 200000000,
            government_funding_amount: 100000000,
            private_funding_amount: 100000000,
            investment_year: 2023,
          },
          {
            company_id: companyData[6].id, // BDL
            technology_id: techData[0].id, // BrahMos
            involvement_type: 'developing' as const,
            rd_investment_amount: 500000000,
            government_funding_amount: 500000000,
            private_funding_amount: 0,
            investment_year: 2023,
          },
        ];

        await db.insertCompanyTechnologies(companyTech.map(ct => ({
          id: crypto.randomUUID(),
          ...ct
        })));

        const trlHistory = [
          {
            technology_id: techData[0].id, // BrahMos
            trl_level: 6,
            assessment_date: '2018-03-15',
            evidence: 'BrahMos-I system prototype demonstrated in operational environment',
            assessed_by: 'DRDO BrahMos Development Team',
            confidence_score: 0.90,
          },
          {
            technology_id: techData[0].id, // BrahMos
            trl_level: 8,
            assessment_date: '2023-06-20',
            evidence: 'BrahMos-II hypersonic variant successfully tested and deployed',
            assessed_by: 'DRDO BrahMos Development Team',
            confidence_score: 0.95,
          },
          {
            technology_id: techData[1].id, // Tejas
            trl_level: 7,
            assessment_date: '2019-03-10',
            evidence: 'Tejas LCA prototype demonstrated in operational environment',
            assessed_by: 'HAL Tejas Development Team',
            confidence_score: 0.88,
          },
          {
            technology_id: techData[1].id, // Tejas
            trl_level: 9,
            assessment_date: '2023-09-15',
            evidence: 'Tejas LCA successfully operational with Indian Air Force',
            assessed_by: 'HAL Tejas Development Team',
            confidence_score: 0.92,
          },
          {
            technology_id: techData[2].id, // Chandrayaan
            trl_level: 8,
            assessment_date: '2022-08-15',
            evidence: 'Chandrayaan-2 mission demonstrated lunar landing capability',
            assessed_by: 'ISRO Lunar Mission Team',
            confidence_score: 0.85,
          },
          {
            technology_id: techData[2].id, // Chandrayaan
            trl_level: 9,
            assessment_date: '2023-08-23',
            evidence: 'Chandrayaan-3 successful soft landing on lunar south pole',
            assessed_by: 'ISRO Lunar Mission Team',
            confidence_score: 0.98,
          },
        ];

        await db.insertTRLHistory(trlHistory.map(trl => ({
          id: crypto.randomUUID(),
          ...trl
        })));

        const marketData = [
          {
            technology_id: techData[0].id, // BrahMos
            year: 2023,
            market_size_usd: 2500000000,
            growth_rate_percent: 25,
            data_source: 'Defence Research and Analysis',
            is_forecast: false,
            confidence_level: 'high' as const,
          },
          {
            technology_id: techData[0].id, // BrahMos
            year: 2025,
            market_size_usd: 4000000000,
            growth_rate_percent: 30,
            data_source: 'Defence Research and Analysis',
            is_forecast: true,
            confidence_level: 'medium' as const,
          },
          {
            technology_id: techData[1].id, // Tejas
            year: 2023,
            market_size_usd: 1500000000,
            growth_rate_percent: 20,
            data_source: 'Aerospace Industry Analysis',
            is_forecast: false,
            confidence_level: 'high' as const,
          },
          {
            technology_id: techData[1].id, // Tejas
            year: 2030,
            market_size_usd: 3500000000,
            growth_rate_percent: 18,
            data_source: 'Aerospace Industry Analysis',
            is_forecast: true,
            confidence_level: 'medium' as const,
          },
          {
            technology_id: techData[3].id, // Aadhaar
            year: 2023,
            market_size_usd: 5000000000,
            growth_rate_percent: 15,
            data_source: 'Digital India Analytics',
            is_forecast: false,
            confidence_level: 'high' as const,
          },
          {
            technology_id: techData[4].id, // UPI
            year: 2023,
            market_size_usd: 12000000000,
            growth_rate_percent: 45,
            data_source: 'Fintech India Report',
            is_forecast: false,
            confidence_level: 'high' as const,
          },
          {
            technology_id: techData[4].id, // UPI
            year: 2030,
            market_size_usd: 50000000000,
            growth_rate_percent: 35,
            data_source: 'Fintech India Report',
            is_forecast: true,
            confidence_level: 'medium' as const,
          },
        ];

        await db.insertMarketData(marketData.map(md => ({
          id: crypto.randomUUID(),
          ...md
        })));

        const forecasts = [
          {
            technology_id: techData[0].id, // BrahMos
            forecast_type: 'trl_progression' as const,
            forecast_data: {
              projections: [
                { year: 2024, trl: 8, confidence: 0.85 },
                { year: 2026, trl: 9, confidence: 0.75 },
                { year: 2028, trl: 9, confidence: 0.70 },
              ],
            },
            time_horizon_years: 5,
            model_used: 'Defence Technology Maturity Analysis',
            confidence_score: 0.82,
            forecast_date: '2023-12-01',
          },
          {
            technology_id: techData[1].id, // Tejas
            forecast_type: 'market_size' as const,
            forecast_data: {
              projections: [
                { year: 2024, size: 1800000000, growth: 20 },
                { year: 2025, size: 2200000000, growth: 22 },
                { year: 2026, size: 2800000000, growth: 27 },
              ],
            },
            time_horizon_years: 3,
            model_used: 'Aerospace Market Growth Model',
            confidence_score: 0.85,
            forecast_date: '2023-12-01',
          },
          {
            technology_id: techData[4].id, // UPI
            forecast_type: 'hype_cycle' as const,
            forecast_data: {
              current_phase: 'Plateau of Productivity',
              phases: [
                { phase: 'Innovation Trigger', year: 2016 },
                { phase: 'Peak of Inflated Expectations', year: 2018 },
                { phase: 'Trough of Disillusionment', year: 2019 },
                { phase: 'Slope of Enlightenment', year: 2021 },
                { phase: 'Plateau of Productivity', year: 2023 },
              ],
            },
            time_horizon_years: 2,
            model_used: 'Digital Payment Adoption Analysis',
            confidence_score: 0.92,
            forecast_date: '2023-12-01',
          },
          {
            technology_id: techData[7].id, // Gaganyaan
            forecast_type: 'trl_progression' as const,
            forecast_data: {
              projections: [
                { year: 2024, trl: 7, confidence: 0.80 },
                { year: 2025, trl: 8, confidence: 0.70 },
                { year: 2026, trl: 9, confidence: 0.60 },
              ],
            },
            time_horizon_years: 3,
            model_used: 'Space Mission Readiness Assessment',
            confidence_score: 0.75,
            forecast_date: '2023-12-01',
          },
        ];

        await db.insertForecasts(forecasts.map(forecast => ({
          id: crypto.randomUUID(),
          ...forecast
        })));

        const dataSources = [
          {
            source_name: 'Indian Patent Office Database',
            source_type: 'patent_db' as const,
            url: 'https://ipindia.gov.in',
            last_sync: new Date(Date.now() - 3600000).toISOString(),
            sync_frequency_hours: 24,
            is_active: true,
            records_ingested: 15678,
            configuration: { api_key: 'sample_key', rate_limit: 1000 },
          },
          {
            source_name: 'DRDO Research Publications',
            source_type: 'publication_db' as const,
            url: 'https://www.drdo.gov.in/publications',
            last_sync: new Date(Date.now() - 7200000).toISOString(),
            sync_frequency_hours: 12,
            is_active: true,
            records_ingested: 5432,
            configuration: { api_key: 'sample_key', rate_limit: 500 },
          },
          {
            source_name: 'ISRO Mission Data',
            source_type: 'market_research' as const,
            url: 'https://www.isro.gov.in/missions',
            last_sync: new Date(Date.now() - 86400000).toISOString(),
            sync_frequency_hours: 48,
            is_active: true,
            records_ingested: 1234,
            configuration: { api_key: 'sample_key', rate_limit: 200 },
          },
          {
            source_name: 'Defence Procurement Database',
            source_type: 'market_research' as const,
            url: 'https://www.defenceprocurement.gov.in',
            last_sync: new Date(Date.now() - 172800000).toISOString(),
            sync_frequency_hours: 72,
            is_active: true,
            records_ingested: 2876,
            configuration: { api_key: 'sample_key', rate_limit: 300 },
          },
          {
            source_name: 'Digital India Analytics',
            source_type: 'market_research' as const,
            url: 'https://www.digitalindia.gov.in/analytics',
            last_sync: new Date(Date.now() - 43200000).toISOString(),
            sync_frequency_hours: 12,
            is_active: true,
            records_ingested: 9876,
            configuration: { api_key: 'sample_key', rate_limit: 800 },
          },
          {
            source_name: 'NPCI Transaction Data',
            source_type: 'company_db' as const,
            url: 'https://www.npci.org.in/data',
            last_sync: new Date(Date.now() - 1800000).toISOString(),
            sync_frequency_hours: 1,
            is_active: true,
            records_ingested: 45678,
            configuration: { api_key: 'sample_key', rate_limit: 2000 },
          },
        ];

        await db.insertDataSources(dataSources.map(ds => ({
          id: crypto.randomUUID(),
          ...ds
        })));
      }
    }

    console.log('Sample data inserted successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error inserting sample data:', error);
    return { success: false, error };
  }
}
