import React, { useState } from 'react';

const ApiDebugger = ({ apiCalls, createdObjects }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="api-debugger-content"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            API Debug Console ({apiCalls.length} calls)
          </h3>
          <span className="text-gray-500 dark:text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div id="api-debugger-content" className="p-6 space-y-6">
          {/* Created Objects */}
          {createdObjects.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Created Objects:
              </h4>
              <div className="flex flex-wrap gap-2">
                {createdObjects.map((obj, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                  >
                    {obj}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* API Calls */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              API Calls:
            </h4>
            <div className="space-y-3">
              {apiCalls.map((call) => (
                <div
                  key={call.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedCall(selectedCall === call.id ? null : call.id)}
                    className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          call.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          call.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {call.method}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {call.endpoint}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          call.status >= 200 && call.status < 300 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          call.status >= 400 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {call.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(call.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </button>

                  {selectedCall === call.id && (
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Request:
                          </h5>
                          <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
                            <code className="text-gray-800 dark:text-gray-200">
                              {JSON.stringify(call.data, null, 2)}
                            </code>
                          </pre>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Response:
                          </h5>
                          <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
                            <code className="text-gray-800 dark:text-gray-200">
                              {JSON.stringify(call.response, null, 2)}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {apiCalls.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl text-gray-400 dark:text-gray-500 mb-2">
                🔧
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No API calls made yet
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiDebugger;
