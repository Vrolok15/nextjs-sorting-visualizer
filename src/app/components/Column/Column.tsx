"use client";

interface ColumnProps {
  height: number;
  width: number;
  isComparing?: boolean;
  isComplete?: boolean;
  isSwapping?: boolean;
}

export default function Column({ height, width, isComparing, isComplete, isSwapping }: ColumnProps) {
  const getColor = () => {
    if (isComplete) return 'var(--color-white)';
    if (isSwapping) return 'var(--color-white)';
    if (isComparing) return 'var(--color-red)';
    return 'var(--color-primary)';
  };
  
  return (
    <div
      style={{
        height: `${height * 2}px`,
        width: `${width}px`,
        backgroundColor: getColor(),
        margin: '0 1px'
      }}
    />
  );
} 