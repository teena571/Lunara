const Symptom = require('../models/Symptom');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all symptoms for logged in user
// @route   GET /api/v1/symptoms
// @access  Private
exports.getSymptoms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const query = { user: req.user.id };

    // Date range filtering
    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      if (req.query.startDate) {
        query.date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.date.$lte = new Date(req.query.endDate);
      }
    }

    const total = await Symptom.countDocuments(query);
    const symptoms = await Symptom.find(query)
      .sort('-date')
      .limit(limit)
      .skip(startIndex)
      .select('-__v');

    res.status(200).json({
      success: true,
      count: symptoms.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: symptoms
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single symptom
// @route   GET /api/v1/symptoms/:id
// @access  Private
exports.getSymptom = async (req, res, next) => {
  try {
    const symptom = await Symptom.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!symptom) {
      return next(new ErrorResponse('Symptom not found', 404));
    }

    res.status(200).json({
      success: true,
      data: symptom
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new symptom log
// @route   POST /api/v1/symptoms
// @access  Private
exports.createSymptom = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const symptom = await Symptom.create(req.body);

    res.status(201).json({
      success: true,
      data: symptom
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update symptom
// @route   PUT /api/v1/symptoms/:id
// @access  Private
exports.updateSymptom = async (req, res, next) => {
  try {
    let symptom = await Symptom.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!symptom) {
      return next(new ErrorResponse('Symptom not found', 404));
    }

    delete req.body.user;

    symptom = await Symptom.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: symptom
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete symptom
// @route   DELETE /api/v1/symptoms/:id
// @access  Private
exports.deleteSymptom = async (req, res, next) => {
  try {
    const symptom = await Symptom.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!symptom) {
      return next(new ErrorResponse('Symptom not found', 404));
    }

    await symptom.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
