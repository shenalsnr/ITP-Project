import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading customer support data...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;