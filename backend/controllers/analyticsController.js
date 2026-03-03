const Cycle = require('../models/Cycle');
const ErrorResponse = require('../utils/errorResponse');

/**
 * ANALYTICS CONTROLLER
 * 
 * MongoDB aggregation pipelines for comprehensive cycle analytics
 */

// @desc    Get monthly average cycle length
// @route   GET /api/v1/analytics/monthly-average
// @access  Private
exports.getMonthlyAverageCycleLength = async (req, res, next) => {
  try {
    const { months = 6 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - parseInt(months));

    const monthlyAverage = await Cycle.aggregate([
      {
        $match: {
          user: req.user._id,
          startDate: { $gte: cutoffDate },
          cycleLength: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$startDate' },
            month: { $month: '$startDate' }
          },
          avgCycleLength: { $avg: '$cycleLength' },
          minCycleLength: { $min: '$cycleLength' },
          maxCycleLength: { $max: '$cycleLength' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          avgCycleLength: { $round: ['$avgCycleLength', 1] },
          minCycleLength: 1,
          maxCycleLength: 1,
          count: 1,
          monthName: {
            $let: {
              vars: {
                monthsInString: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
              },
              in: { $arrayElemAt: ['$$monthsInString', '$_id.month'] }
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: monthlyAverage.length,
      data: monthlyAverage
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get mood frequency distribution
// @route   GET /api/v1/analytics/mood-distribution
// @access  Private
exports.getMoodDistribution = async (req, res, next) => {
  try {
    // Note: This would require a Mood model or mood data in Cycle model
    // For now, returning structure for frontend integration
    
    const { months = 6 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - parseInt(months));

    // If moods are stored in a separate collection
    // const moodDistribution = await Mood.aggregate([...])
    
    // Placeholder response structure
    res.status(200).json({
      success: true,
      message: 'Mood distribution endpoint ready for Mood model integration',
      data: {
        happy: 0,
        calm: 0,
        energetic: 0,
        sad: 0,
        anxious: 0,
        irritable: 0,
        tired: 0,
        stressed: 0
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get flow intensity statistics
// @route   GET /api/v1/analytics/flow-intensity
// @access  Private
exports.getFlowIntensityStats = async (req, res, next) => {
  try {
    const { months = 6 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - parseInt(months));

    const flowStats = await Cycle.aggregate([
      {
        $match: {
          user: req.user._id,
          startDate: { $gte: cutoffDate },
          flow: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$flow',
          count: { $sum: 1 },
          avgPeriodLength: { $avg: '$periodLength' }
        }
      },
      {
        $project: {
          _id: 0,
          flow: '$_id',
          count: 1,
          avgPeriodLength: { $round: ['$avgPeriodLength', 1] },
          percentage: {
            $multiply: [
              { $divide: ['$count', { $sum: '$count' }] },
              100
            ]
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Calculate total for percentage
    const total = flowStats.reduce((sum, item) => sum + item.count, 0);
    const flowStatsWithPercentage = flowStats.map(item => ({
      ...item,
      percentage: Math.round((item.count / total) * 100)
    }));

    res.status(200).json({
      success: true,
      count: flowStatsWithPercentage.length,
      total,
      data: flowStatsWithPercentage
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get irregularity trend over time
// @route   GET /api/v1/analytics/irregularity-trend
// @access  Private
exports.getIrregularityTrend = async (req, res, next) => {
  try {
    const { months = 6 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - parseInt(months));

    const irregularityTrend = await Cycle.aggregate([
      {
        $match: {
          user: req.user._id,
          startDate: { $gte: cutoffDate },
          cycleLength: { $exists: true, $ne: null }
        }
      },
      {
        $sort: { startDate: 1 }
      },
      {
        $group: {
          _id: {
            year: { $year: '$startDate' },
            month: { $month: '$startDate' }
          },
          cycleLengths: { $push: '$cycleLength' },
          avgCycleLength: { $avg: '$cycleLength' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          avgCycleLength: { $round: ['$avgCycleLength', 1] },
          count: 1,
          cycleLengths: 1,
          // Calculate standard deviation
          stdDev: {
            $cond: {
              if: { $gte: ['$count', 2] },
              then: { $stdDevPop: '$cycleLengths' },
              else: 0
            }
          }
        }
      },
      {
        $addFields: {
          stdDev: { $round: ['$stdDev', 1] },
          isIrregular: { $gte: ['$stdDev', 8] },
          monthName: {
            $let: {
              vars: {
                monthsInString: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
              },
              in: { $arrayElemAt: ['$$monthsInString', '$month'] }
            }
          }
        }
      },
      {
        $sort: { year: 1, month: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: irregularityTrend.length,
      data: irregularityTrend
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get comprehensive analytics dashboard data
// @route   GET /api/v1/analytics/dashboard
// @access  Private
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const { months = 6 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - parseInt(months));

    // Run multiple aggregations in parallel
    const [
      overallStats,
      monthlyTrend,
      flowDistribution,
      symptomFrequency
    ] = await Promise.all([
      // Overall statistics
      Cycle.aggregate([
        {
          $match: {
            user: req.user._id,
            startDate: { $gte: cutoffDate }
          }
        },
        {
          $group: {
            _id: null,
            totalCycles: { $sum: 1 },
            avgCycleLength: { $avg: '$cycleLength' },
            avgPeriodLength: { $avg: '$periodLength' },
            minCycleLength: { $min: '$cycleLength' },
            maxCycleLength: { $max: '$cycleLength' },
            cycleLengths: { $push: '$cycleLength' }
          }
        },
        {
          $project: {
            _id: 0,
            totalCycles: 1,
            avgCycleLength: { $round: ['$avgCycleLength', 1] },
            avgPeriodLength: { $round: ['$avgPeriodLength', 1] },
            minCycleLength: 1,
            maxCycleLength: 1,
            stdDev: {
              $round: [{ $stdDevPop: '$cycleLengths' }, 1]
            },
            isIrregular: {
              $gte: [{ $stdDevPop: '$cycleLengths' }, 8]
            }
          }
        }
      ]),

      // Monthly trend
      Cycle.aggregate([
        {
          $match: {
            user: req.user._id,
            startDate: { $gte: cutoffDate },
            cycleLength: { $exists: true }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$startDate' },
              month: { $month: '$startDate' }
            },
            avgCycleLength: { $avg: '$cycleLength' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]),

      // Flow distribution
      Cycle.aggregate([
        {
          $match: {
            user: req.user._id,
            startDate: { $gte: cutoffDate },
            flow: { $exists: true }
          }
        },
        {
          $group: {
            _id: '$flow',
            count: { $sum: 1 }
          }
        }
      ]),

      // Symptom frequency
      Cycle.aggregate([
        {
          $match: {
            user: req.user._id,
            startDate: { $gte: cutoffDate },
            symptoms: { $exists: true, $ne: [] }
          }
        },
        {
          $unwind: '$symptoms'
        },
        {
          $group: {
            _id: '$symptoms',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: overallStats[0] || {},
        monthlyTrend,
        flowDistribution,
        topSymptoms: symptomFrequency,
        timeRange: {
          months: parseInt(months),
          from: cutoffDate,
          to: new Date()
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get symptom correlation analysis
// @route   GET /api/v1/analytics/symptom-correlation
// @access  Private
exports.getSymptomCorrelation = async (req, res, next) => {
  try {
    const symptomCorrelation = await Cycle.aggregate([
      {
        $match: {
          user: req.user._id,
          symptoms: { $exists: true, $ne: [] }
        }
      },
      {
        $unwind: '$symptoms'
      },
      {
        $group: {
          _id: {
            symptom: '$symptoms',
            flow: '$flow'
          },
          count: { $sum: 1 },
          avgCycleLength: { $avg: '$cycleLength' }
        }
      },
      {
        $group: {
          _id: '$_id.symptom',
          totalOccurrences: { $sum: '$count' },
          byFlow: {
            $push: {
              flow: '$_id.flow',
              count: '$count'
            }
          },
          avgCycleLength: { $avg: '$avgCycleLength' }
        }
      },
      {
        $sort: { totalOccurrences: -1 }
      },
      {
        $project: {
          _id: 0,
          symptom: '$_id',
          totalOccurrences: 1,
          byFlow: 1,
          avgCycleLength: { $round: ['$avgCycleLength', 1] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: symptomCorrelation.length,
      data: symptomCorrelation
    });
  } catch (err) {
    next(err);
  }
};
