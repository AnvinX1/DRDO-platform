import express from 'express';
import Technology from '../models/Technology.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Get all technologies
// @route   GET /api/technologies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { domain, status, trl, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = {};
    
    if (domain) query.domain = domain;
    if (status) query.status = status;
    if (trl) {
      const trlRange = trl.split('-');
      if (trlRange.length === 2) {
        query.currentTRL = { $gte: parseInt(trlRange[0]), $lte: parseInt(trlRange[1]) };
      } else {
        query.currentTRL = parseInt(trl);
      }
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Execute query with pagination
    const technologies = await Technology.find(query)
      .populate('patentCount')
      .populate('publicationCount')
      .populate('companyCount')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Technology.countDocuments(query);

    res.json({
      success: true,
      count: technologies.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: technologies
    });

  } catch (error) {
    logger.error('Error fetching technologies:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching technologies'
    });
  }
});

// @desc    Get single technology
// @route   GET /api/technologies/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const technology = await Technology.findById(req.params.id)
      .populate('patentCount')
      .populate('publicationCount')
      .populate('companyCount');

    if (!technology) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found'
      });
    }

    res.json({
      success: true,
      data: technology
    });

  } catch (error) {
    logger.error('Error fetching technology:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching technology'
    });
  }
});

// @desc    Create new technology
// @route   POST /api/technologies
// @access  Private
router.post('/', async (req, res) => {
  try {
    const technology = await Technology.create(req.body);

    res.status(201).json({
      success: true,
      data: technology
    });

  } catch (error) {
    logger.error('Error creating technology:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating technology'
    });
  }
});

// @desc    Update technology
// @route   PUT /api/technologies/:id
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const technology = await Technology.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!technology) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found'
      });
    }

    res.json({
      success: true,
      data: technology
    });

  } catch (error) {
    logger.error('Error updating technology:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating technology'
    });
  }
});

// @desc    Delete technology
// @route   DELETE /api/technologies/:id
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const technology = await Technology.findByIdAndDelete(req.params.id);

    if (!technology) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found'
      });
    }

    res.json({
      success: true,
      message: 'Technology deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting technology:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting technology'
    });
  }
});

// @desc    Get technology statistics
// @route   GET /api/technologies/stats/overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Technology.aggregate([
      {
        $group: {
          _id: null,
          totalTechnologies: { $sum: 1 },
          averageTRL: { $avg: '$currentTRL' },
          emergingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'emerging'] }, 1, 0] }
          },
          developingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'developing'] }, 1, 0] }
          },
          matureCount: {
            $sum: { $cond: [{ $eq: ['$status', 'mature'] }, 1, 0] }
          },
          decliningCount: {
            $sum: { $cond: [{ $eq: ['$status', 'declining'] }, 1, 0] }
          }
        }
      }
    ]);

    const domainStats = await Technology.aggregate([
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 },
          averageTRL: { $avg: '$currentTRL' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        domainBreakdown: domainStats
      }
    });

  } catch (error) {
    logger.error('Error fetching technology statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics'
    });
  }
});

export default router;
