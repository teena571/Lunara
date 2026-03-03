import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../utils/axios';

/**
 * DownloadReport Component
 * 
 * IMPORTANT: This component should ONLY be used in the Dashboard page.
 * 
 * Features:
 * - Generates comprehensive PDF health report
 * - Includes last 6 months of cycle data
 * - Shows mood trends and wellness insights
 * - Route-based visibility control
 * 
 * Usage:
 * - Import only in Dashboard.jsx
 * - Do NOT use in other pages (Analytics, Insights, Profile, etc.)
 * 
 * @returns {JSX.Element|null} Download report card or null if not on dashboard
 */
const DownloadReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();

  // Route-based visibility control
  // Only show on dashboard route
  const isAllowedRoute = location.pathname === '/dashboard';

  // If not on allowed route, don't render anything
  if (!isAllowedRoute) {
    console.warn('DownloadReport component should only be used on Dashboard page');
    return null;
  }

  const downloadReport = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('/reports/health-report', {
        responseType: 'blob' // Important for file download
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date
      const filename = `Lunara_Health_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      link.setAttribute('download', filename);
      
      // Append to html link element page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Download error:', err);
      setError(err.response?.data?.message || 'Failed to download report');
      
      // Clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const previewReport = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('/reports/health-report/preview', {
        responseType: 'blob'
      });

      // Create blob URL and open in new tab
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
      
      // Clean up after a delay
      setTimeout(() => window.URL.revokeObjectURL(url), 100);

    } catch (err) {
      console.error('Preview error:', err);
      setError(err.response?.data?.message || 'Failed to preview report');
      
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
          <span className="text-2xl">📄</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Health Report</h3>
          <p className="text-sm text-gray-600">Download your wellness summary</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Report Includes:</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Last 6 months cycle summary
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Average cycle length & regularity
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Irregularity score & assessment
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Mood trends & symptom analysis
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Personalized wellness recommendations
          </li>
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={downloadReport}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF</span>
            </>
          )}
        </button>

        <button
          onClick={previewReport}
          disabled={loading}
          className="px-4 py-3 border-2 border-purple-500 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          title="Preview in browser"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Report generated from your last 6 months of data
      </p>
    </div>
  );
};

export default DownloadReport;
