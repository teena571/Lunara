import { useMemo } from 'react';
import { useCycle } from '../context/CycleContext';
import { useMood } from '../context/MoodContext';
import { analyzePMSPatterns, predictNextPMSWindow, generatePMSPrediction } from '../utils/pmsPrediction';

const CycleDetection = ({ onClose }) => {
  const { cycles, predictions } = useCycle();
  const { moodEntries } = useMood();

  // Calculate cycle statistics
  const cycleStats = useMemo(() => {
    if (cycles.length === 0) return null;

    const cycleLengths = cycles
      .filter(c => c.cycleLength && c.cycleLength > 0)
      .map(c => c.cycleLength);

    if (cycleLengths.length === 0) return null;

    const avgLength = Math.round(
      cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
    );

    const stdDev = Math.sqrt(
      cycleLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / cycleLengths.length
    );

    const isRegular = stdDev <= 7;

    return {
      avgLength,
      stdDev: stdDev.toFixed(1),
      isRegular,
      totalCycles: cycles.length
    };
  }, [cycles]);

  // PMS Prediction
  const pmsPrediction = useMemo(() => {
    const analysis = analyzePMSPatterns(cycles, moodEntries);
    const pmsWindow = predictions ? predictNextPMSWindow(predictions) : null;
    return generatePMSPrediction(analysis, pmsWindow);
  }, [cycles, moodEntries, predictions]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">Cycle Detection & Analysis</h2>
              <p className="text-purple-100">Comprehensive insights into your menstrual health</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Cycle Length Analysis */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Cycle Length Analysis</h3>
                <p className="text-sm text-gray-600">Based on your tracked cycles</p>
              </div>
            </div>

            {cycleStats ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Average Cycle Length</p>
                  <p className="text-3xl font-bold text-purple-600">{cycleStats.avgLength} days</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Cycle Regularity</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {cycleStats.isRegular ? '✓ Regular' : '⚠ Irregular'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Standard Deviation</p>
                  <p className="text-2xl font-bold text-gray-700">{cycleStats.stdDev} days</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Cycles Analyzed</p>
                  <p className="text-2xl font-bold text-gray-700">{cycleStats.totalCycles}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Log at least 2 cycles to see analysis</p>
            )}
          </div>

          {/* Ovulation Prediction */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Ovulation Prediction</h3>
                <p className="text-sm text-gray-600">Estimated fertile window</p>
              </div>
            </div>

            {predictions && predictions.nextPeriodDate ? (
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Predicted Ovulation</p>
                  <p className="text-xl font-bold text-green-600">
                    {new Date(new Date(predictions.nextPeriodDate).setDate(
                      new Date(predictions.nextPeriodDate).getDate() - 14
                    )).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">~14 days before next period</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Fertile Window</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(new Date(predictions.nextPeriodDate).setDate(
                        new Date(predictions.nextPeriodDate).getDate() - 19
                      )).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium text-gray-700">
                      {new Date(new Date(predictions.nextPeriodDate).setDate(
                        new Date(predictions.nextPeriodDate).getDate() - 13
                      )).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">5 days before to 1 day after ovulation</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Log cycles to see ovulation predictions</p>
            )}
          </div>

          {/* Fertile Window */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌸</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Fertile Window</h3>
                <p className="text-sm text-gray-600">Your most fertile days</p>
              </div>
            </div>

            {predictions && predictions.fertileWindow ? (
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Peak Fertility Period</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    6-7 days
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Starts: {new Date(predictions.fertileWindow.start).toLocaleDateString('en-US', { 
                        month: 'long', day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Ends: {new Date(predictions.fertileWindow.end).toLocaleDateString('en-US', { 
                        month: 'long', day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Log cycles to see fertile window</p>
            )}
          </div>

          {/* PMS Prediction - NEW FEATURE */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 border border-rose-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">PMS Prediction</h3>
                <p className="text-sm text-gray-600">AI-powered pattern detection</p>
              </div>
            </div>

            {pmsPrediction.available ? (
              <div className="space-y-4">
                {/* Analysis Summary */}
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Analysis Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {pmsPrediction.cyclesAnalyzed} cycles analyzed
                    </span>
                  </div>
                  {pmsPrediction.hasPatterns ? (
                    <p className="text-sm text-gray-600">
                      ✓ Recurring patterns detected with 60%+ consistency
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      No consistent patterns detected yet. Keep tracking!
                    </p>
                  )}
                </div>

                {/* Next PMS Window */}
                {pmsPrediction.nextPMSWindow && (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">Next PMS Window</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-rose-600">
                        {pmsPrediction.nextPMSWindow.daysUntilPMS > 0 
                          ? `In ${pmsPrediction.nextPMSWindow.daysUntilPMS} days`
                          : pmsPrediction.nextPMSWindow.isInPMSWindow 
                            ? 'Active Now' 
                            : 'Passed'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(pmsPrediction.nextPMSWindow.pmsStartDate).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric' 
                      })} - {new Date(pmsPrediction.nextPMSWindow.pmsEndDate).toLocaleDateString('en-US', { 
                        month: 'short', day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}

                {/* Recurring Moods */}
                {pmsPrediction.recurringMoods && pmsPrediction.recurringMoods.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Recurring PMS Moods</p>
                    <div className="space-y-2">
                      {pmsPrediction.recurringMoods.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 capitalize">{item.mood}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-rose-500 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recurring Symptoms */}
                {pmsPrediction.recurringSymptoms && pmsPrediction.recurringSymptoms.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Recurring PMS Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                      {pmsPrediction.recurringSymptoms.map((item, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm"
                        >
                          {item.symptom} ({item.percentage}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {pmsPrediction.recommendations && pmsPrediction.recommendations.length > 0 && (
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Personalized Tips</p>
                    <div className="space-y-3">
                      {pmsPrediction.recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="flex gap-3">
                          <span className="text-2xl">{rec.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{rec.title}</p>
                            <p className="text-xs text-gray-600">{rec.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-600 mb-2">{pmsPrediction.message}</p>
                <p className="text-sm text-gray-500">
                  Track your cycles and log your moods regularly to enable PMS prediction.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-2xl border-t">
          <button
            onClick={onClose}
            className="w-full btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CycleDetection;
