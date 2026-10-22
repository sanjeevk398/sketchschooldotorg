'use client';

import React from 'react';
import { GuideLine } from '@/data/curriculum';

interface GhostGuideOverlayProps {
  guides: GuideLine[];
  width: number;
  height: number;
  showGuides: boolean;
  gridType: 'none' | 'dots' | 'grid';
}

export const GhostGuideOverlay: React.FC<GhostGuideOverlayProps> = ({
  guides,
  width,
  height,
  showGuides,
  gridType,
}) => {
  return (
    <svg
      className="absolute inset-0 pointer-events-none select-none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <pattern
          id="dot-grid"
          x="0"
          y="0"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
        </pattern>
        <pattern
          id="line-grid"
          x="0"
          y="0"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 30 0 L 0 0 0 30"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* Background Grid */}
      {gridType === 'dots' && (
        <rect width={width} height={height} fill="url(#dot-grid)" />
      )}
      {gridType === 'grid' && (
        <rect width={width} height={height} fill="url(#line-grid)" />
      )}

      {/* Interactive Lesson Guides */}
      {showGuides &&
        guides.map((g, idx) => {
          if (g.type === 'point') {
            return (
              <g key={idx}>
                <circle
                  cx={g.cx}
                  cy={g.cy}
                  r={8}
                  className="fill-brand-primary/20 stroke-brand-primary stroke-2 animate-pulse"
                />
                <circle cx={g.cx} cy={g.cy} r={3} className="fill-brand-primary" />
                {g.label && (
                  <text
                    x={g.cx! + 12}
                    y={g.cy! + 4}
                    className="text-xs font-semibold fill-slate-500 select-none"
                    style={{ fontSize: '11px' }}
                  >
                    {g.label}
                  </text>
                )}
              </g>
            );
          }

          if (g.type === 'line') {
            return (
              <g key={idx}>
                <line
                  x1={g.x1}
                  y1={g.y1}
                  x2={g.x2}
                  y2={g.y2}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  opacity={0.6}
                />
                {g.label && (
                  <text
                    x={((g.x1 ?? 0) + (g.x2 ?? 0)) / 2}
                    y={((g.y1 ?? 0) + (g.y2 ?? 0)) / 2 - 8}
                    textAnchor="middle"
                    className="text-[10px] font-medium fill-slate-400 select-none"
                  >
                    {g.label}
                  </text>
                )}
              </g>
            );
          }

          if (g.type === 'circle') {
            return (
              <g key={idx}>
                <circle
                  cx={g.cx}
                  cy={g.cy}
                  r={g.r}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  opacity={0.6}
                />
                {g.label && (
                  <text
                    x={g.cx}
                    y={(g.cy ?? 0) - (g.r ?? 0) - 8}
                    textAnchor="middle"
                    className="text-[10px] font-medium fill-slate-400 select-none"
                  >
                    {g.label}
                  </text>
                )}
              </g>
            );
          }

          if (g.type === 'rect') {
            return (
              <g key={idx}>
                <rect
                  x={g.x1}
                  y={g.y1}
                  width={g.w}
                  height={g.h}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity={0.7}
                  rx="4"
                />
                {g.label && (
                  <text
                    x={g.x1}
                    y={(g.y1 ?? 0) - 6}
                    className="text-[10px] font-medium fill-slate-400 select-none"
                  >
                    {g.label}
                  </text>
                )}
              </g>
            );
          }

          return null;
        })}
    </svg>
  );
};
