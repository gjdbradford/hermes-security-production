import React from 'react';

const TestNeedsAssessment = () => {
  console.log('🔍 TestNeedsAssessment component mounted');

  return (
    <div className='min-h-screen bg-red-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-red-800 mb-4'>🚨 TEST NEEDS ASSESSMENT FORM 🚨</h1>
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-semibold mb-4'>This is a test component</h2>
          <p className='text-gray-700 mb-4'>
            If you can see this, the routing is working correctly.
          </p>
          <div className='bg-blue-50 p-4 rounded border'>
            <p className='text-blue-800'>
              <strong>URL:</strong> {window.location.href}
            </p>
            <p className='text-blue-800'>
              <strong>Email Parameter:</strong>{' '}
              {new URLSearchParams(window.location.search).get('email') || 'None'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNeedsAssessment;
