import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export default function SparklesIcon({ size = 24, color = '#111827' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L13.09 8.26L19 9.27L13.09 10.28L12 16.54L10.91 10.28L5 9.27L10.91 8.26L12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="4" cy="19" r="2" fill={color} />
      <Circle cx="20" cy="19" r="2" fill={color} />
      <Circle cx="4" cy="4" r="1" fill={color} />
      <Circle cx="20" cy="4" r="1" fill={color} />
    </Svg>
  );
}

