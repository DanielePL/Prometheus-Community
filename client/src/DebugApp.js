// Debug App to test imports and identify errors
import React from 'react';

// Test imports one by one
import SimpleFeed from './components/dashboard/SimpleFeed';
import FeedSimple from './components/dashboard/FeedSimple';
import ModularDashboard from './components/dashboard/ModularDashboard';

const DebugApp = () => {
  const mockUser = {
    name: 'Test User',
    avatar: 'TU',
    email: 'test@test.com',
    stats: {
      workouts: 156,
      totalVolume: '45,670 kg',
      prs: 23,
      streak: 67
    }
  };

  console.log('Components loaded:', { SimpleFeed, FeedSimple, ModularDashboard });

  return (
    <div style={{ padding: '20px', background: 'black', color: 'white', minHeight: '100vh' }}>
      <h1>Component Debug Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Testing ModularDashboard Component:</h2>
        {ModularDashboard ? (
          <ModularDashboard user={mockUser} onLogout={() => console.log('Logout clicked')} />
        ) : (
          <p>ModularDashboard component is undefined!</p>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Testing SimpleFeed Component:</h2>
        {SimpleFeed ? <SimpleFeed user={mockUser} /> : <p>SimpleFeed component is undefined!</p>}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Testing FeedSimple Component:</h2>
        {FeedSimple ? <FeedSimple user={mockUser} /> : <p>FeedSimple component is undefined!</p>}
      </div>
    </div>
  );
};

export default DebugApp;
