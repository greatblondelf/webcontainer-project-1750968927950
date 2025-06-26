import React, { useState, useRef } from 'react';
import FileUpload from './components/FileUpload';
import ExtractionProgress from './components/ExtractionProgress';
import DataOutput from './components/DataOutput';
import RandomColorButton from './components/RandomColorButton';
import ApiDebugger from './components/ApiDebugger';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState([]);
  const [apiCalls, setApiCalls] = useState([]);
  const [createdObjects, setCreatedObjects] = useState([]);

  const API_BASE = 'https://staging.impromptu-labs.com/api_tools';
  const API_HEADERS = {
    'Authorization': 'Bearer 37fe7c79edf25f42__-__sean',
    'Content-Type': 'application/json'
  };

  const logApiCall = (method, endpoint, data, response) => {
    const call = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      method,
      endpoint,
      data,
      response,
      status: response?.status || 'pending'
    };
    setApiCalls(prev => [call, ...prev]);
    return call;
  };

  const handleFileUpload = async (files) => {
    setUploadedFiles(files);
    setCurrentStep(2);
    setIsExtracting(true);
    setExtractionProgress(0);

    try {
      // Simulate file reading and API calls
      const fileContents = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const content = await readFileAsText(file);
        fileContents.push(content);
        setExtractionProgress(((i + 1) / files.length) * 50);
      }

      // Call input_data API
      const objectName = `uploaded_files_${Date.now()}`;
      const inputDataCall = logApiCall('POST', '/input_data', {
        created_object_name: objectName,
        data_type: 'strings',
        input_data: fileContents
      });

      const inputResponse = await fetch(`${API_BASE}/input_data`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          created_object_name: objectName,
          data_type: 'strings',
          input_data: fileContents
        })
      });

      const inputResult = await inputResponse.json();
      inputDataCall.response = inputResult;
      inputDataCall.status = inputResponse.status;

      setCreatedObjects(prev => [...prev, objectName]);
      setExtractionProgress(75);

      // Apply prompt to extract structured data
      const promptObjectName = `extracted_data_${Date.now()}`;
      const promptCall = logApiCall('POST', '/apply_prompt', {
        created_object_names: [promptObjectName],
        prompt_string: 'Extract key information from this data: {input_data}',
        inputs: [{
          object_name: objectName,
          processing_mode: 'combine_events'
        }]
      });

      const promptResponse = await fetch(`${API_BASE}/apply_prompt`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          created_object_names: [promptObjectName],
          prompt_string: 'Extract key information from this data: {input_data}',
          inputs: [{
            object_name: objectName,
            processing_mode: 'combine_events'
          }]
        })
      });

      const promptResult = await promptResponse.json();
      promptCall.response = promptResult;
      promptCall.status = promptResponse.status;

      setCreatedObjects(prev => [...prev, promptObjectName]);
      setExtractionProgress(100);

      // Get the extracted data
      const dataCall = logApiCall('GET', `/return_data/${promptObjectName}`);
      const dataResponse = await fetch(`${API_BASE}/return_data/${promptObjectName}`, {
        headers: API_HEADERS
      });

      const dataResult = await dataResponse.json();
      dataCall.response = dataResult;
      dataCall.status = dataResponse.status;

      // Convert to table format
      const tableData = parseExtractedData(dataResult.text_value);
      setExtractedData(tableData);

      setTimeout(() => {
        setIsExtracting(false);
        setCurrentStep(3);
      }, 1000);

    } catch (error) {
      console.error('Extraction failed:', error);
      setIsExtracting(false);
      setCurrentStep(1);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const parseExtractedData = (textValue) => {
    // Simple parsing - in real app this would be more sophisticated
    const lines = textValue.split('\n').filter(line => line.trim());
    return lines.map((line, index) => ({
      id: index + 1,
      content: line.trim(),
      type: 'extracted',
      timestamp: new Date().toISOString()
    }));
  };

  const handleCancel = () => {
    setIsExtracting(false);
    setCurrentStep(1);
    setUploadedFiles([]);
    setExtractionProgress(0);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedFiles([]);
    setExtractedData([]);
    setExtractionProgress(0);
    setIsExtracting(false);
  };

  const deleteAllObjects = async () => {
    for (const objectName of createdObjects) {
      try {
        const deleteCall = logApiCall('DELETE', `/objects/${objectName}`);
        const response = await fetch(`${API_BASE}/objects/${objectName}`, {
          method: 'DELETE',
          headers: API_HEADERS
        });
        deleteCall.response = await response.text();
        deleteCall.status = response.status;
      } catch (error) {
        console.error(`Failed to delete ${objectName}:`, error);
      }
    }
    setCreatedObjects([]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upload & Extract Flow
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Random Color Button Demo */}
          <div className="mb-8">
            <RandomColorButton />
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol className="flex items-center justify-center space-x-5">
                {[
                  { id: 1, name: 'Upload Files', status: currentStep >= 1 ? 'complete' : 'upcoming' },
                  { id: 2, name: 'Extract Data', status: currentStep >= 2 ? (currentStep === 2 ? 'current' : 'complete') : 'upcoming' },
                  { id: 3, name: 'View Results', status: currentStep >= 3 ? 'complete' : 'upcoming' }
                ].map((step, stepIdx) => (
                  <li key={step.name} className="relative">
                    <div className="flex items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          step.status === 'complete'
                            ? 'bg-primary-600 border-primary-600'
                            : step.status === 'current'
                            ? 'border-primary-600 bg-white dark:bg-gray-800'
                            : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600'
                        }`}
                      >
                        {step.status === 'complete' ? (
                          <span className="text-white">✓</span>
                        ) : (
                          <span className={`text-sm font-medium ${
                            step.status === 'current' ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {step.id}
                          </span>
                        )}
                      </div>
                      <span className={`ml-3 text-sm font-medium ${
                        step.status === 'complete' || step.status === 'current'
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
            {currentStep === 1 && (
              <FileUpload onFileUpload={handleFileUpload} />
            )}
            
            {currentStep === 2 && (
              <ExtractionProgress 
                progress={extractionProgress}
                isExtracting={isExtracting}
                onCancel={handleCancel}
              />
            )}
            
            {currentStep === 3 && (
              <DataOutput 
                data={extractedData}
                onReset={handleReset}
              />
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setApiCalls([])}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              aria-label="Show API results"
            >
              Show Raw API Results
            </button>
            <button
              onClick={deleteAllObjects}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              aria-label="Delete all objects"
            >
              Delete All Objects
            </button>
          </div>

          {/* API Debugger */}
          <ApiDebugger apiCalls={apiCalls} createdObjects={createdObjects} />
        </main>
      </div>
    </div>
  );
};

export default App;
