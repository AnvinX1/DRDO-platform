import express from 'express';
import Patent from '../models/Patent.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get all patents
// @route   GET /api/patents
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { technologyId, country, status, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (technologyId) query.technologyId = technologyId;
    if (country) query.countryCode = country;
    if (status) query.legalStatus = status;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } },
        { 'assignee.name': { $regex: search, $options: 'i' } }
      ];
    }

    const patents = await Patent.find(query)
      .populate('technologyId', 'name domain')
      .sort({ filingDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Patent.countDocuments(query);

    res.json({
      success: true,
      count: patents.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: patents
    });

  } catch (error) {
    logger.error('Error fetching patents:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching patents'
    });
  }
});

// @desc    Get patent statistics
// @route   GET /api/patents/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await Patent.aggregate([
      {
        $group: {
          _id: null,
          totalPatents: { $sum: 1 },
          averageCitations: { $avg: '$citationCount' },
          grantedCount: {
            $sum: { $cond: [{ $eq: ['$legalStatus', 'granted'] }, 1, 0] }
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$legalStatus', 'pending'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {}
    });

  } catch (error) {
    logger.error('Error fetching patent statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching patent statistics'
    });
  }
});

export default router;
