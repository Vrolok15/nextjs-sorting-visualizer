"use client";

import styles from './page.module.css';
import { useState, useEffect, useRef } from 'react';
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
  const [swapping, setSwapping] = useState<number[]>([]);
  const shouldStopRef = useRef<boolean>(false);

  const generateArray = () => {
    shouldStopRef.current = true;
    setIsSorting(false);
    const newArray = Array.from({ length: arraySize }, 
      () => Math.floor(Math.random() * 256) + 10
    );
    setArray(newArray);
    setSorted(false);
    setColumnWidth(Math.floor((window.innerWidth * 0.75) / arraySize));
    setComparing([]);
    setComplete([]);
    setSwapping([]);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    shouldStopRef.current = false;
    setIsSorting(true);

    try {
      let i: number;
      let j: number;
      let temp: number;
      let swapped: boolean;
      const newArray = [...array];

      for (i = 0; i < newArray.length; i++) {
        if (shouldStopRef.current) return;
        swapped = false;
        for (j = 0; j < newArray.length - i - 1; j++) {
          if (shouldStopRef.current) return;
          setComparing([j, j + 1]);
          await delay(500 /newArray.length);
          
          if (newArray[j] > newArray[j + 1]) {
            if (shouldStopRef.current) return;
            temp = newArray[j];
            newArray[j] = newArray[j + 1];
            newArray[j + 1] = temp;
            swapped = true;
            setArray([...newArray]);
            setSwapping([j, j + 1]);
            await delay(400 /newArray.length);
            
            setSwapping([]);
          }
        }
        setComparing([]);
        if (!swapped) break;
      }
      if (!shouldStopRef.current) {
        for (i = 0; i < newArray.length; i++) {
          if (shouldStopRef.current) return;
          setComplete(prev => [...prev, i]);
          await delay(50);
        }
        setSorted(true);
        await delay(100);
        setComparing([]);
        setComplete([]);
      }
    } finally {
      setIsSorting(false);
    }
  };

  const selectionSort = async () => {
    shouldStopRef.current = false;
    setIsSorting(true);
    try {
      let minIndex: number;
      let minValue: number;
      const newArray = [...array];

      for (let i = 0; i < newArray.length; i++) {
        if (shouldStopRef.current) return;
        minIndex = i;
        for (let j = i + 1; j < newArray.length; j++) {
          if (shouldStopRef.current) return;
          if (newArray[j] < newArray[minIndex]) {
            minIndex = j;
          }
          setComparing([j, minIndex]);
          await delay(800 / newArray.length);
        }
        
        if (shouldStopRef.current) return;
        minValue = newArray.splice(minIndex, 1)[0];
        newArray.splice(i, 0, minValue);
        setArray([...newArray]);
        setSwapping([i, minIndex]);
        await delay(400 / newArray.length);
        
        setSwapping([]);
        setComparing([]);
      }
      if (!shouldStopRef.current) {
        for (let i = 0; i < newArray.length; i++) {
          if (shouldStopRef.current) return;
          setComplete(prev => [...prev, i]);
          await delay(50);
        }
        setSorted(true);
        await delay(100);
        setComplete([]);
      }
    } finally {
      setIsSorting(false);
    }
  };

  const insertionSort = async () => {
    shouldStopRef.current = false;
    setIsSorting(true);
    try {
      const newArray = [...array];
      for (let i = 1; i < newArray.length; i++) {
        let insertionIndex = i;
        let currentValue = newArray.splice(i, 1)[0];
        for (let j = i - 1; j >= 0; j--) {
          if (shouldStopRef.current) return;
          setComparing([j, i]);
          await delay(800 / newArray.length);
          if (newArray[j] > currentValue) {
            insertionIndex = j;
          }
          setComparing([]);
        }
        newArray.splice(insertionIndex, 0, currentValue);
        setArray([...newArray]);
        setSwapping([i, insertionIndex]);
        await delay(400 / newArray.length);
        setSwapping([]);
      }
      if (!shouldStopRef.current) {
        for (let i = 0; i < newArray.length; i++) {
          if (shouldStopRef.current) return;
          setComplete(prev => [...prev, i]);
          await delay(50);
        }
        setSorted(true);
      }
    } finally {
      setIsSorting(false);
    }
  };

  const partition = async (arr: number[], low: number, high: number) => {
    if (shouldStopRef.current) return;
    
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (shouldStopRef.current) return;
      
      setComparing([j, pivot]);
      await delay(800 / arr.length);

      if (arr[j] < pivot) {
        i++;
        // Swap elements
        setSwapping([i, j]);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await delay(400 / arr.length);
        setSwapping([]);
      }
      setComparing([]);
    }

    // Place pivot in correct position
    setSwapping([i + 1, high]);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await delay(400 / arr.length);
    setSwapping([]);

    return i + 1;
  };

  const quickSort = async () => {
    shouldStopRef.current = false;
    setIsSorting(true);
    try {
      const newArray = [...array];
      let low = 0;
      let high = newArray.length - 1;
      const quickSortHelper = async (arr: number[], low: number, high: number) => {
        if (low < high) {
          const pivotIndex = await partition(arr, low, high);
          if (pivotIndex !== undefined) {
            await quickSortHelper(arr, low, pivotIndex - 1);
            await quickSortHelper(arr, pivotIndex + 1, high);
          }
        }
      } 
      await quickSortHelper(newArray, low, high);
      if (!shouldStopRef.current) {
        for (let i = 0; i < newArray.length; i++) {
          if (shouldStopRef.current) return;
          setComplete(prev => [...prev, i]);
          await delay(50);
        }
        setSorted(true);
      }
    } finally {
      setIsSorting(false);
    }
  };

  const merge = async (left: number[], right: number[]): Promise<number[]> => {
    const result: number[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    return [...result, ...left.slice(i), ...right.slice(j)];
  };

  const mergeSortHelper = async (arr: number[], startIdx: number, workingArray: number[]): Promise<number[]> => {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    const sortedLeft = await mergeSortHelper(left, startIdx, workingArray);
    const sortedRight = await mergeSortHelper(right, startIdx + mid, workingArray);
    
    const result = await merge(sortedLeft, sortedRight);
    
    // Update working array and visualize
    for (let i = 0; i < result.length; i++) {
      if (shouldStopRef.current) return result;
      
      const currentIdx = startIdx + i;
      workingArray[currentIdx] = result[i];
      setArray([...workingArray]);
      setComparing([currentIdx, currentIdx + 1]);
      await delay(800 / workingArray.length);
      setSwapping([currentIdx]);
      await delay(400 / workingArray.length);
      setSwapping([]);
    }
    
    setComparing([]);
    return result;
  };

  const mergeSort = async () => {
    shouldStopRef.current = false;
    setIsSorting(true);
    try {
      if (!shouldStopRef.current) {
        const workingArray = [...array];
        await mergeSortHelper(workingArray, 0, workingArray);
        if (!shouldStopRef.current) {
          for (let i = 0; i < workingArray.length; i++) {
            if (shouldStopRef.current) return;
            setComplete(prev => [...prev, i]);
            await delay(50);
          }
          setSorted(true);
        }
      }
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
              isSwapping={swapping.includes(index)}
            />
          ))}
        </div>
        {isSorting && !sorted && (
          <div className={`${styles.controls} ${styles.sorted}`}>
            <p>Sorting...</p>
            <button className={styles.button} onClick={() => shouldStopRef.current = true}>Stop</button>
          </div>
        )}
        {sorted && (
          <div className={`${styles.controls} ${styles.sorted}`}>
            <p>Array sorted!</p>
          </div>
        )}
        {array.length > 0 && !isSorting && !sorted && (
          <div className={`${styles.controls} ${styles.sorts}`}>
            <button 
              className={styles.button}
              onClick={bubbleSort}
              disabled={isSorting}
            >
              Bubble Sort
            </button>
            <button 
              className={styles.button} 
              onClick={selectionSort}
              disabled={isSorting}
            >
              Selection Sort
            </button>
            <button 
              className={styles.button} 
              onClick={insertionSort}
              disabled={isSorting}
            >
              Insertion Sort
            </button>
            <button 
              className={styles.button} 
              onClick={quickSort}
              disabled={isSorting}
            >
              Quick Sort
            </button>
            <button 
              className={styles.button} 
              onClick={mergeSort}
              disabled={isSorting}
            >
              Merge Sort
            </button>
            <button className={styles.button} disabled={isSorting}>Heap Sort</button>
            <button className={styles.button} disabled={isSorting}>Radix Sort</button>
          </div>
        )}
        {!isSorting && (
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
        )}
      </main>
      <footer className={styles.footer}>
        <p>
          © 2024 No rights reserved. Sorting Algorithms Visualizer
        </p>
      </footer>
    </div>
  );
}
