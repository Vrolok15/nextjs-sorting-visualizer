"use client";

import styles from './page.module.css';
import { useState, useEffect, useRef } from 'react';
import Column from './components/Column/Column';

// Base delay times in milliseconds
const DELAYS = {
  COMPARE: 800,
  SWAP: 400,
  COMPLETE: 50,
  FINAL: 500
} as const;

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
  const audioContextRef = useRef<AudioContext | null>(null);
  const [speed, setSpeed] = useState<number>(5);
  const speedRef = useRef<number>(5);

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
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const playNote = (frequency: number, duration: number = 400 / array.length) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      // Fade out to avoid clicks
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration / 1000);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  };

  const playCompletionAnimation = async (arr: number[]) => {
    if (shouldStopRef.current) return;
    
    for (let i = 0; i < arr.length; i++) {
      if (shouldStopRef.current) return;
      setComplete(prev => [...prev, i]);
      playNote(200 + arr[i] * 4, 100);
      await delay(100);
    }
    setSorted(true);
    playNote(1000, 500);
  };

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
          playNote(200 + newArray[j] * 2, getDelay(DELAYS.COMPARE));
          setComparing([j, j + 1]);
          await delay(getDelay(DELAYS.COMPARE));
          
          if (newArray[j] > newArray[j + 1]) {
            if (shouldStopRef.current) return;
            playNote(200 + newArray[j] * 2, getDelay(DELAYS.COMPARE));
            temp = newArray[j];
            newArray[j] = newArray[j + 1];
            newArray[j + 1] = temp;
            swapped = true;
            setArray([...newArray]);
            setSwapping([j, j + 1]);
            await delay(getDelay(DELAYS.SWAP));
            
            setSwapping([]);
          }
        }
        setComparing([]);
        if (!swapped) break;
      }
      if (!shouldStopRef.current) {
        await playCompletionAnimation(newArray);
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
          playNote(200 + newArray[j] * 2, getDelay(DELAYS.COMPARE));
          setComparing([j, minIndex]);
          await delay(getDelay(DELAYS.COMPARE));
        }
        
        if (shouldStopRef.current) return;
        minValue = newArray.splice(minIndex, 1)[0];
        newArray.splice(i, 0, minValue);
        setArray([...newArray]);
        setSwapping([i, minIndex]);
        playNote(200 + newArray[i] * 2, getDelay(DELAYS.SWAP));
        await delay(getDelay(DELAYS.SWAP));
        
        setSwapping([]);
        setComparing([]);
      }
      if (!shouldStopRef.current) {
        await playCompletionAnimation(newArray);
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
          await delay(getDelay(DELAYS.COMPARE));
          if (newArray[j] > currentValue) {
            playNote(200 + newArray[j] * 2, getDelay(DELAYS.COMPARE));
            insertionIndex = j;
          }
          else {
            playNote(200 + newArray[j] * 2, getDelay(DELAYS.COMPARE));
          }
          setComparing([]);
        }
        newArray.splice(insertionIndex, 0, currentValue);
        setArray([...newArray]);
        setSwapping([i, insertionIndex]);
        await delay(getDelay(DELAYS.SWAP));
        setSwapping([]);
      }
      if (!shouldStopRef.current) {
        await playCompletionAnimation(newArray);
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
      
      setComparing([j, high]);
      await delay(getDelay(DELAYS.COMPARE));

      if (arr[j] < pivot) {
        playNote(200 + arr[j] * 2, getDelay(DELAYS.COMPARE));
        i++;
        // Swap elements
        setSwapping([i, j]);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await delay(getDelay(DELAYS.SWAP));
        setSwapping([]);
      }
      else{
        playNote(200 + arr[j] * 2, getDelay(DELAYS.COMPARE));
      }
      setComparing([]);
    }

    // Place pivot in correct position
    setSwapping([i + 1, high]);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await delay(getDelay(DELAYS.SWAP));
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
        await playCompletionAnimation(newArray);
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
      playNote(200 + workingArray[currentIdx] * 2, getDelay(DELAYS.COMPARE));
      await delay(getDelay(DELAYS.COMPARE));
      setSwapping([currentIdx]);
      await delay(getDelay(DELAYS.SWAP));
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
          await playCompletionAnimation(workingArray);
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

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(e.target.value);
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
  };

  const getDelay = (baseDelay: number) => baseDelay / speedRef.current;

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
          </div>
        )}
        {!isSorting && (
        <div className={styles.controls}>
          <label className={styles.label} htmlFor="arraySize">Array Size: {arraySize}</label>
          <input 
            id="arraySize"
            type="range" 
            min="10" 
            max={window.innerWidth <= 768 ? "50" : "100"} 
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
        <div className={styles.controls}>
          <label className={styles.label} htmlFor="speed">Speed: {speed}x</label>
          <input 
            id="speed"
            type="range" 
            min="1" 
            max="50" 
            step="0.5"
            value={speed}
            onChange={handleSpeedChange}
            className={styles.slider} 
          />
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
