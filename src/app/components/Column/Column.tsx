"use client";

interface ColumnProps {
  height: number;
  width: number;
}

export default function Column({ height, width }: ColumnProps) {
  
  return (
    <div
      style={{
        height: `${height * 2}px`,
        width: `${width}px`,
        backgroundColor: 'var(--color-primary)',
        margin: '0 1px',
      }}
    />
  );
} 