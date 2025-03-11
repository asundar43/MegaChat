import React, { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ResizableDividerProps {
  color: string;
  onResize: (delta: number) => void;
  className?: string;
}

export function ResizableDivider({ color, onResize, className }: ResizableDividerProps) {
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    document.body.style.cursor = 'col-resize';
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const delta = e.clientX - startX.current;
      onResize(delta);
      startX.current = e.clientX;
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
      
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize]);

  return (
    <div
      className={cn(
        "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:w-2 transition-all group z-50",
        "after:absolute after:top-1/2 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-8 after:rounded-full after:bg-current after:opacity-0 after:transition-opacity",
        "hover:after:opacity-100",
        className
      )}
      style={{ 
        backgroundColor: color,
        opacity: isDragging.current ? 0.4 : 0.2,
        color: color,
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: color }}
      />
    </div>
  );
} 