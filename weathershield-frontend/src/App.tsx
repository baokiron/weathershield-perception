import React from 'react';
import Navbar from './components/Navbar';
import SplitDashboard from './components/SplitDashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <SplitDashboard />
    </div>
  );
};

export default App;