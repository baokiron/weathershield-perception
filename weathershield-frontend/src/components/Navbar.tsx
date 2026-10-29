import React from 'react';

const Navbar: React.FC = () => {
  return (<header className="sticky top-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
  {
    <h1 className='text-white font-bold text-lg'>WeatherShield Perception</h1>
  }
  
  {
    <div className='flex items-center gap-2'>
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>

        <p className=" text-slate-300">AI Engine: online</p>
    </div>
  }
</header>);
};

export default Navbar;