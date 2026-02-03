import React from 'react';
import { PlayerColor } from './types';

export const COLORS: Record<PlayerColor, string> = {
  pink: 'bg-mft-pink',
  yellow: 'bg-mft-yellow',
  green: 'bg-mft-green',
  blue: 'bg-mft-blue',
  purple: 'bg-mft-purple',
  orange: 'bg-mft-orange',
};

export const TEXT_COLORS: Record<PlayerColor, string> = {
  pink: 'text-mft-pink',
  yellow: 'text-mft-yellow',
  green: 'text-mft-green',
  blue: 'text-mft-blue',
  purple: 'text-mft-purple',
  orange: 'text-mft-orange',
};

export const BORDER_COLORS: Record<PlayerColor, string> = {
  pink: 'border-mft-pink',
  yellow: 'border-mft-yellow',
  green: 'border-mft-green',
  blue: 'border-mft-blue',
  purple: 'border-mft-purple',
  orange: 'border-mft-orange',
};

// SVG Icons
export const HeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const BrokenHeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    <path d="M12 21.35V3" stroke="white" strokeWidth="2" />
    <path d="M9 8L15 14" stroke="white" strokeWidth="2" />
  </svg>
);

export const EyeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const MAX_TRICKS = 5;
export const TOTAL_ROUNDS = 2;
