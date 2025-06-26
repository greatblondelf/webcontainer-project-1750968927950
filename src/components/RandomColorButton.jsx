import React, { useState } from 'react';

const RandomColorButton = () => {
  const [buttonColor, setButtonColor] = useState('#3b82f6');

  const getRandomColor = () => {
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
      '#f1c40f', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#00bcd4', '#009688',
      '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b',
      '#ffc107', '#ff9800', '#ff5722', '#795548'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleClick = () => {
    setButtonColor(getRandomColor());
  };

  return (
    <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Random Color Button Demo
      </h2>
      <button
        onClick={handleClick}
        style={{ backgroundColor: buttonColor }}
        className="px-8 py-4 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50"
        style={{
          backgroundColor: buttonColor,
          boxShadow: `0 10px 25px ${buttonColor}33`
        }}
        aria-label="Click to change button color randomly"
      >
        Click me to change color!
      </button>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Current color: {buttonColor}
      </p>
    </div>
  );
};

export default RandomColorButton;
