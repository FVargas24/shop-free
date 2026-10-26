import { cn } from '@/lib/utils';
import React from 'react';

export interface RetroGridProps {
  className?: string;
  angle?: number;
  cellSize?: number;
  opacity?: number;
}

export function RetroGrid({
  className,
  angle = 65,
  cellSize = 50,
  opacity = 0.5,
}: RetroGridProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute size-full overflow-hidden [perspective:200px]',
        className
      )}
      style={{
        opacity,
        ['--grid-angle' as any]: `${angle}deg`,
      }}
    >
      {/* Grid container with 3D perspective rotation */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            'animate-[grid_20s_linear_infinite]',
            '[background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:200%]',
            // Line colors that dynamically adapt to Tailwind theme variables in light & dark mode
            '[background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_0),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_0)]'
          )}
          style={{
            ['--cell-size' as any]: `${cellSize}px`,
          }}
        />
      </div>

      {/* Radial fade mask to make it look smooth and blend with background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
    </div>
  );
}
