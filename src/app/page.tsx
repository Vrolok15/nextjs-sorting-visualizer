"use client";

import styles from './page.module.css';
import { useState, useEffect } from 'react';

export default function Home() {
  const [arraySize, setArraySize] = useState<number>(10);
  const [mounted, setMounted] = useState(false);
  const [sorted, setSorted] = useState<boolean>(false);
  const [array, setArray] = useState<number[]>([]);

  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, 
      () => Math.floor(Math.random() * 256)
    );
    setArray(newArray);
    setSorted(false);
    console.log(newArray);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArraySize(Number(e.target.value));
  };

  if (!mounted) return null;

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>Sorting Algorithms Visualizer</h1>
        <div className={styles.columns}>
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
