/**
 * REPORT CONTROLLER
 * 
 * Handles PDF health report generation and download
 */

const { generateHealthReport } = require('../services/pdfService');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @route   GET /api/v1/reports/health-report
 * @desc    Generate and download PDF health report
 * @access  Private
 */
exports.downloadHealthReport = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Generate PDF
    const doc = await generateHealthReport(userId);

    // Set response headers for PDF download
    const filename = `Lunara_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);
    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    next(new ErrorResponse('Failed to generate health report', 500));
  }
};

/**
 * @route   GET /api/v1/reports/health-report/preview
 * @desc    Preview PDF health report in browser
 * @access  Private
 */
exports.previewHealthReport = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Generate PDF
    const doc = await generateHealthReport(userId);

    // Set response headers for inline display
    const filename = `Lunara_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Pipe PDF to response
    doc.pipe(res);
    doc.end();

  } catch (error) {
    console.error('PDF preview error:', error);
    next(new ErrorResponse('Failed to preview health report', 500));
  }
};
