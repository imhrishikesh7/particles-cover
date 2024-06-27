import React, { useState, useEffect } from 'react';
import './App.css';
import Scene from './components/Particles/Particles';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const texts = ['Imagine', 'Design', 'Position']; // Array of texts to cycle through
  const [textIndex, setTextIndex] = useState(0); // State to track current text index
  const [cycleComplete, setCycleComplete] = useState(false); // State to track if the cycle is complete

  useEffect(() => {
    if (cycleComplete) return; // Stop the effect if the cycle is complete

    // Set a timer to change text every 4 seconds
    const textTimer = setInterval(() => {
      setTextIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (newIndex === texts.length) {
          clearInterval(textTimer); // Clear the timer once the cycle is complete
          setCycleComplete(true); // Set the cycle complete state
          return prevIndex;
        }
        return newIndex % texts.length;
      });
    }, 4000);

    // Clean up timer on component unmount
    return () => {
      clearInterval(textTimer);
    };
  }, [cycleComplete, texts.length]);

  return (
    <div className="app-container">
      <img className='cover-logo' src="./Tata_Comm_logo.svg" alt="" />
      <h1 className='re'>Re</h1> {/* Static text */}
      <p className='cover-subtitle'>Integrated <br />Report 2023-24</p>
      <div className="scene-container">
        <h1 className='imagine'>
          <AnimatePresence mode="wait">
            <motion.span
              key={textIndex} // Unique key for each text change
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {texts[textIndex]}
            </motion.span>
          </AnimatePresence>
        </h1>
        <Scene />
      </div>
    </div>
  );
}

export default App;
