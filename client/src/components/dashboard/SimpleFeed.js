// Simple Test Component without external dependencies
import React from 'react';

const SimpleFeed = ({ user }) => {
  return (
    <div style={{ padding: '20px', background: '#111', color: 'white' }}>
      <h1>Simple Feed Test</h1>
      <p>User: {user?.name || 'No user'}</p>
      <div style={{ background: '#222', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
        <h3>Test Post</h3>
        <p>This is a simple test post without external dependencies.</p>
      </div>
    </div>
  );
};

export default SimpleFeed;
