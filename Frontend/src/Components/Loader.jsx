// src/components/Loader.jsx

import React from 'react';

const Loader = () => {
  return (
    <div className="loader flex justify-center items-center h-32">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
