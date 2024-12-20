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
  const [comparing, setComparing] = useState<number[]>([]);
  const [complete, setComplete] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);

  const generateArray = () => {
    setIsSorting(false);
    const newArray = Array.from({ length: arraySize }, 
      () => Math.floor(Math.random() * 256) + 1
    );
    setArray(newArray);
    setSorted(false);
    setColumnWidth(Math.floor((window.innerWidth * 0.75) / arraySize));
    setComparing([]);
    setComplete([]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);

    try {
      let i: number;
      let j: number;
      let temp: number;
      let swapped: boolean;
      const newArray = [...array];

      for (i = 0; i < newArray.length; i++) {
        swapped = false;
        for (j = 0; j < newArray.length - i - 1; j++) {
          setComparing([j, j + 1]);
          await delay(500 /newArray.length);
          
          if (newArray[j] > newArray[j + 1]) {
            temp = newArray[j];
            newArray[j] = newArray[j + 1];
            newArray[j + 1] = temp;
            swapped = true;
            setArray([...newArray]);
          }
        }
        setComparing([]);
        if (!swapped) break;
      }
      for (i = 0; i < newArray.length; i++) {
        setComplete(prev => [...prev, i]);
        await delay(50);
      }
      setSorted(true);
      await delay(100);
      setComparing([]);
      setComplete([]);
    } finally {
      setIsSorting(false);
    }
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
              isComparing={comparing.includes(index)}
              isComplete={complete.includes(index)}
            />
          ))}
        </div>
        {sorted && (
          <div className={`${styles.controls} ${styles.sorted}`}>
            <p>Array sorted!</p>
          </div>
        )}
        {!isSorting && !sorted && (
          <div className={`${styles.controls} ${styles.sorts}`}>
            <button 
              className={styles.button}
              onClick={bubbleSort}
              disabled={isSorting}
            >
              Bubble Sort
            </button>
            <button className={styles.button} disabled={isSorting}>Merge Sort</button>
            <button className={styles.button} disabled={isSorting}>Quick Sort</button>
            <button className={styles.button} disabled={isSorting}>Heap Sort</button>
            <button className={styles.button} disabled={isSorting}>Insertion Sort</button>
            <button className={styles.button} disabled={isSorting}>Selection Sort</button>
            <button className={styles.button} disabled={isSorting}>Radix Sort</button>
          </div>
        )}
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
