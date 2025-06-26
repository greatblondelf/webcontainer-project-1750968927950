import React from 'react';

const ExtractionProgress = ({ progress, isExtracting, onCancel }) => {
  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Extracting Data
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Please wait while we process your files...
        </p>
      </div>

      {/* Spinner */}
      <div className="flex justify-center">
        <div className="spinner"></div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`Extraction progress: ${progress}%`}
          ></div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {progress < 25 && "Reading files..."}
        {progress >= 25 && progress < 50 && "Processing content..."}
        {progress >= 50 && progress < 75 && "Extracting data..."}
        {progress >= 75 && progress < 100 && "Finalizing results..."}
        {progress === 100 && "Complete!"}
      </div>

      {/* Cancel Button */}
      {isExtracting && (
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          aria-label="Cancel extraction process"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default ExtractionProgress;
