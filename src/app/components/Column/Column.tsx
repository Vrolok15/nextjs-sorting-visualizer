"use client";

interface ColumnProps {
  height: number;
  width: number;
  isComparing?: boolean;
  isComplete?: boolean;
}

export default function Column({ height, width, isComparing, isComplete }: ColumnProps) {
  const getColor = () => {
    if (isComplete) return 'var(--color-white)';
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