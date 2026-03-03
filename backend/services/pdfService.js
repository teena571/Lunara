/**
 * PDF HEALTH REPORT SERVICE
 * 
 * Generates comprehensive wellness reports in PDF format
 * Includes cycle data, mood trends, and health insights
 */

const PDFDocument = require('pdfkit');
const Cycle = require('../models/Cycle');
const User = require('../models/User');

/**
 * Calculate cycle statistics
 */
const calculateCycleStats = (cycles) => {
  if (cycles.length === 0) {
    return {
      totalCycles: 0,
      avgCycleLength: 0,
      avgPeriodLength: 0,
      irregularityScore: 0,
      cycleLengths: []
    };
  }

  const cycleLengths = cycles
    .filter(c => c.cycleLength && c.cycleLength > 0)
    .map(c => c.cycleLength);

  const periodLengths = cycles
    .filter(c => c.startDate && c.endDate)
    .map(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    });

  // Calculate average cycle length
  const avgCycleLength = cycleLengths.length > 0
    ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    : 0;

  // Calculate average period length
  const avgPeriodLength = periodLengths.length > 0
    ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
    : 0;

  // Calculate standard deviation for irregularity
  let irregularityScore = 0;
  if (cycleLengths.length > 1) {
    const mean = avgCycleLength;
    const squareDiffs = cycleLengths.map(length => Math.pow(length - mean, 2));
    const variance = squareDiffs.reduce((a, b) => a + b, 0) / cycleLengths.length;
    const stdDev = Math.sqrt(variance);
    
    // Convert to 0-100 score (higher = more irregular)
    irregularityScore = Math.min(100, Math.round((stdDev / 8) * 100));
  }

  return {
    totalCycles: cycles.length,
    avgCycleLength,
    avgPeriodLength,
    irregularityScore,
    cycleLengths
  };
};

/**
 * Calculate mood statistics
 */
const calculateMoodStats = (cycles) => {
  const allMoods = [];
  const allSymptoms = [];

  cycles.forEach(cycle => {
    if (cycle.mood) allMoods.push(cycle.mood);
    if (cycle.symptoms && Array.isArray(cycle.symptoms)) {
      allSymptoms.push(...cycle.symptoms);
    }
  });

  // Count mood frequencies
  const moodCounts = {};
  allMoods.forEach(mood => {
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  // Find most common mood
  const mostCommonMood = Object.keys(moodCounts).length > 0
    ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b)
    : 'N/A';

  // Count symptom frequencies
  const symptomCounts = {};
  allSymptoms.forEach(symptom => {
    symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
  });

  // Get top 3 symptoms
  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([symptom]) => symptom);

  return {
    totalMoodEntries: allMoods.length,
    mostCommonMood,
    moodDistribution: moodCounts,
    topSymptoms,
    totalSymptoms: allSymptoms.length
  };
};

/**
 * Generate PDF Health Report
 */
const generateHealthReport = async (userId) => {
  // Fetch user data
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }

  // Fetch last 6 months of cycles
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const cycles = await Cycle.find({
    user: userId,
    startDate: { $gte: sixMonthsAgo }
  }).sort({ startDate: -1 });

  // Calculate statistics
  const cycleStats = calculateCycleStats(cycles);
  const moodStats = calculateMoodStats(cycles);

  // Create PDF document
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  // Colors (Wellness theme)
  const colors = {
    primary: '#9b87f5',    // Lavender
    secondary: '#ffa07a',  // Peach
    accent: '#7dd3c0',     // Mint
    text: '#333333',
    lightGray: '#f5f5f5',
    mediumGray: '#cccccc'
  };

  // Helper function to add section
  const addSection = (title, y) => {
    doc.fontSize(16)
       .fillColor(colors.primary)
       .text(title, 50, y, { underline: true })
       .moveDown(0.5);
  };

  // Helper function to add key-value pair
  const addKeyValue = (key, value, y) => {
    doc.fontSize(11)
       .fillColor(colors.text)
       .text(key + ':', 50, y, { continued: true, width: 200 })
       .fillColor(colors.primary)
       .text(' ' + value, { width: 450 });
  };

  // ===== HEADER =====
  doc.rect(0, 0, 612, 80).fill(colors.primary);
  
  doc.fontSize(28)
     .fillColor('#ffffff')
     .text('🌸 Lunara Wellness Report', 50, 25);

  doc.fontSize(12)
     .fillColor('#ffffff')
     .text('Your Personal Health Summary', 50, 55);

  // ===== USER INFO SECTION =====
  let yPos = 120;
  addSection('Personal Information', yPos);
  yPos += 30;

  addKeyValue('Name', user.name, yPos);
  yPos += 20;
  addKeyValue('Email', user.email, yPos);
  yPos += 20;
  addKeyValue('Report Date', new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }), yPos);
  yPos += 20;
  addKeyValue('Report Period', 'Last 6 Months', yPos);
  yPos += 40;

  // ===== CYCLE SUMMARY SECTION =====
  addSection('Cycle Summary', yPos);
  yPos += 30;

  // Box for cycle stats
  doc.rect(50, yPos, 500, 120)
     .fillAndStroke(colors.lightGray, colors.mediumGray);
  yPos += 15;

  addKeyValue('Total Cycles Tracked', cycleStats.totalCycles.toString(), yPos);
  yPos += 25;
  addKeyValue('Average Cycle Length', cycleStats.avgCycleLength + ' days', yPos);
  yPos += 25;
  addKeyValue('Average Period Length', cycleStats.avgPeriodLength + ' days', yPos);
  yPos += 25;

  // Irregularity score with color coding
  let irregularityText = cycleStats.irregularityScore + '/100';
  let irregularityLevel = 'Low';
  let irregularityColor = '#34D399'; // Green

  if (cycleStats.irregularityScore > 60) {
    irregularityLevel = 'High';
    irregularityColor = '#EF4444'; // Red
  } else if (cycleStats.irregularityScore > 30) {
    irregularityLevel = 'Moderate';
    irregularityColor = '#F59E0B'; // Orange
  }

  doc.fontSize(11)
     .fillColor(colors.text)
     .text('Irregularity Score:', 50, yPos, { continued: true, width: 200 });
  
  doc.fillColor(irregularityColor)
     .text(' ' + irregularityText + ' (' + irregularityLevel + ')', { width: 450 });
  
  yPos += 40;

  // ===== REGULARITY ASSESSMENT =====
  addSection('Cycle Regularity Assessment', yPos);
  yPos += 30;

  let regularityMessage = '';
  if (cycleStats.irregularityScore < 30) {
    regularityMessage = '✓ Your cycles are regular and consistent. Keep maintaining your healthy habits!';
  } else if (cycleStats.irregularityScore < 60) {
    regularityMessage = '⚠ Your cycles show moderate variation. Consider tracking lifestyle factors that may affect regularity.';
  } else {
    regularityMessage = '⚠ Your cycles show significant variation. Consider consulting with a healthcare provider.';
  }

  doc.fontSize(11)
     .fillColor(colors.text)
     .text(regularityMessage, 50, yPos, { width: 500, align: 'justify' });
  yPos += 50;

  // ===== MOOD & SYMPTOMS SECTION =====
  addSection('Mood & Symptoms Summary', yPos);
  yPos += 30;

  // Box for mood stats
  doc.rect(50, yPos, 500, 100)
     .fillAndStroke(colors.lightGray, colors.mediumGray);
  yPos += 15;

  addKeyValue('Total Mood Entries', moodStats.totalMoodEntries.toString(), yPos);
  yPos += 25;
  addKeyValue('Most Common Mood', moodStats.mostCommonMood, yPos);
  yPos += 25;
  addKeyValue('Top Symptoms', moodStats.topSymptoms.length > 0 
    ? moodStats.topSymptoms.join(', ') 
    : 'None recorded', yPos);
  yPos += 50;

  // ===== MOOD DISTRIBUTION =====
  if (Object.keys(moodStats.moodDistribution).length > 0) {
    addSection('Mood Distribution', yPos);
    yPos += 30;

    Object.entries(moodStats.moodDistribution)
      .sort((a, b) => b[1] - a[1])
      .forEach(([mood, count]) => {
        const percentage = Math.round((count / moodStats.totalMoodEntries) * 100);
        
        doc.fontSize(11)
           .fillColor(colors.text)
           .text(mood + ':', 70, yPos, { width: 150 });
        
        // Progress bar
        const barWidth = (percentage / 100) * 300;
        doc.rect(220, yPos + 2, 300, 12)
           .fillAndStroke(colors.lightGray, colors.mediumGray);
        doc.rect(220, yPos + 2, barWidth, 12)
           .fill(colors.accent);
        
        doc.fillColor(colors.text)
           .text(percentage + '%', 530, yPos);
        
        yPos += 25;
      });
    
    yPos += 20;
  }

  // ===== NEW PAGE FOR RECOMMENDATIONS =====
  doc.addPage();
  yPos = 50;

  // Header for new page
  doc.rect(0, 0, 612, 60).fill(colors.secondary);
  doc.fontSize(20)
     .fillColor('#ffffff')
     .text('Wellness Recommendations', 50, 20);

  yPos = 100;

  // ===== PERSONALIZED RECOMMENDATIONS =====
  addSection('Personalized Health Tips', yPos);
  yPos += 30;

  const recommendations = [];

  // Based on irregularity
  if (cycleStats.irregularityScore > 60) {
    recommendations.push({
      icon: '🩺',
      title: 'Consult Healthcare Provider',
      text: 'Your cycle shows significant variation. Consider scheduling a check-up to discuss your menstrual health.'
    });
  }

  // Based on cycle length
  if (cycleStats.avgCycleLength > 35) {
    recommendations.push({
      icon: '⏰',
      title: 'Monitor Cycle Length',
      text: 'Your average cycle is longer than typical. Track any lifestyle changes that might affect your cycle.'
    });
  } else if (cycleStats.avgCycleLength < 21) {
    recommendations.push({
      icon: '⏰',
      title: 'Short Cycle Alert',
      text: 'Your cycles are shorter than average. This may be normal for you, but consider discussing with a doctor.'
    });
  }

  // General recommendations
  recommendations.push(
    {
      icon: '💧',
      title: 'Stay Hydrated',
      text: 'Drink 8-10 glasses of water daily to support overall health and reduce bloating during your period.'
    },
    {
      icon: '🥗',
      title: 'Balanced Nutrition',
      text: 'Eat iron-rich foods, leafy greens, and omega-3 fatty acids to support menstrual health.'
    },
    {
      icon: '🧘‍♀️',
      title: 'Stress Management',
      text: 'Practice yoga, meditation, or deep breathing to reduce stress, which can affect cycle regularity.'
    },
    {
      icon: '😴',
      title: 'Quality Sleep',
      text: 'Aim for 7-9 hours of sleep per night to support hormonal balance and overall wellness.'
    }
  );

  // Display recommendations
  recommendations.forEach(rec => {
    doc.fontSize(13)
       .fillColor(colors.primary)
       .text(rec.icon + ' ' + rec.title, 50, yPos);
    yPos += 20;

    doc.fontSize(10)
       .fillColor(colors.text)
       .text(rec.text, 70, yPos, { width: 480, align: 'justify' });
    yPos += 35;
  });

  // ===== FOOTER =====
  const footerY = 750;
  doc.rect(0, footerY, 612, 92).fill(colors.lightGray);
  
  doc.fontSize(10)
     .fillColor(colors.text)
     .text('This report is for informational purposes only and does not constitute medical advice.', 50, footerY + 15, {
       width: 500,
       align: 'center'
     });
  
  doc.fontSize(9)
     .fillColor(colors.mediumGray)
     .text('Generated by Lunara Wellness Platform', 50, footerY + 40, {
       width: 500,
       align: 'center'
     });
  
  doc.fontSize(9)
     .fillColor(colors.mediumGray)
     .text('© ' + new Date().getFullYear() + ' Lunara. All rights reserved.', 50, footerY + 55, {
       width: 500,
       align: 'center'
     });

  return doc;
};

module.exports = {
  generateHealthReport
};
