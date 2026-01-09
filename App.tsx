import React from 'react';
import { WarehouseFinder } from './components/WarehouseFinder';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <WarehouseFinder />
    </div>
  );
};

export default App;