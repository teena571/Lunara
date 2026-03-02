const Cycle = require('../models/Cycle');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all cycles for logged in user
// @route   GET /api/v1/cycles
// @access  Private
exports.getCycles = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Build query - only user's own data
    const query = { user: req.user.id };

    // Date filtering
    if (req.query.startDate) {
      query.startDate = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      query.endDate = { $lte: new Date(req.query.endDate) };
    }

    const total = await Cycle.countDocuments(query);
    const cycles = await Cycle.find(query)
      .sort('-startDate')
      .limit(limit)
      .skip(startIndex)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: cycles.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: cycles
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single cycle
// @route   GET /api/v1/cycles/:id
// @access  Private
exports.getCycle = async (req, res, next) => {
  try {
    const cycle = await Cycle.findOne({
      _id: req.params.id,
      user: req.user.id // Ensure user owns this data
    });

    if (!cycle) {
      return next(new ErrorResponse('Cycle not found', 404));
    }

    res.status(200).json({
      success: true,
      data: cycle
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new cycle
// @route   POST /api/v1/cycles
// @access  Private
exports.createCycle = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const cycle = await Cycle.create(req.body);

    res.status(201).json({
      success: true,
      data: cycle
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update cycle
// @route   PUT /api/v1/cycles/:id
// @access  Private
exports.updateCycle = async (req, res, next) => {
  try {
    let cycle = await Cycle.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!cycle) {
      return next(new ErrorResponse('Cycle not found', 404));
    }

    // Prevent user field modification
    delete req.body.user;

    cycle = await Cycle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: cycle
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete cycle
// @route   DELETE /api/v1/cycles/:id
// @access  Private
exports.deleteCycle = async (req, res, next) => {
  try {
    const cycle = await Cycle.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!cycle) {
      return next(new ErrorResponse('Cycle not found', 404));
    }

    await cycle.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get cycle statistics
// @route   GET /api/v1/cycles/stats
// @access  Private
exports.getCycleStats = async (req, res, next) => {
  try {
    const stats = await Cycle.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: null,
          avgCycleLength: { $avg: '$cycleLength' },
          avgPeriodLength: { $avg: '$periodLength' },
          totalCycles: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || { avgCycleLength: 0, avgPeriodLength: 0, totalCycles: 0 }
    });
  } catch (err) {
    next(err);
  }
};
