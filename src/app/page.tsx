"use client";

import styles from './page.module.css';
import { useState, useEffect } from 'react';
import Column from './components/Column/Column';

export default function Home() {
  const [arraySize, setArraySize] = useState<number>(10);
  const [mounted, setMounted] = useState(false);
  const [sorted, setSorted] = useState<boolean>(false);
  const [array, setArray] = useState<number[]>([]);
  const [columnWidth, setColumnWidth] = useState<number>(80);

  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, 
      () => Math.floor(Math.random() * 256) + 1
    );
    setArray(newArray);
    setSorted(false);
    setColumnWidth(Math.floor((window.innerWidth * 0.75) / arraySize));
    console.log(newArray);
  };

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (array.length > 0) {
        setColumnWidth(Math.floor((window.innerWidth * 0.75) / array.length));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [array.length]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArraySize(Number(e.target.value));
  };

  if (!mounted) return null;

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>Sorting Algorithms Visualizer</h1>
        <div className={styles.columns}>
          {array.map((value, index) => (
            <Column
              key={index}
              height={value}
              width={columnWidth}
            />
          ))}
        </div>
        <div className={styles.controls}>
          <button className={styles.button}>Bubble Sort</button>
          <button className={styles.button}>Merge Sort</button>
          <button className={styles.button}>Quick Sort</button>
          <button className={styles.button}>Heap Sort</button>
          <button className={styles.button}>Insertion Sort</button>
          <button className={styles.button}>Selection Sort</button>
          <button className={styles.button}>Radix Sort</button>
        </div>
        <div className={styles.controls}>
          <label htmlFor="arraySize">Array Size: {arraySize}</label>
          <input 
            id="arraySize"
            type="range" 
            min="10" 
            max="100" 
            value={arraySize}
            onChange={handleSliderChange}
            className={styles.slider} 
          />
          <button 
            className={styles.button}
            onClick={generateArray}
          >
            Generate random array
          </button>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>
          © 2024 No rights reserved. Sorting Algorithms Visualizer
        </p>
      </footer>
    </div>
  );
}
