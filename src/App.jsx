import React, { useEffect } from 'react';
import FullPageScroll from './components/FullPageScroll';
import './index.css';

function App() {
  useEffect(() => {
    // Fix for Safari mobile viewport height
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return (
    <div className="app">
      <main>
        <FullPageScroll />
      </main>
    </div>
  );
}

export default App;
