import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export default function QrCodeIcon({ size = 24, color = '#111827' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="5" height="5" stroke={color} strokeWidth="2" />
      <Rect x="16" y="3" width="5" height="5" stroke={color} strokeWidth="2" />
      <Rect x="3" y="16" width="5" height="5" stroke={color} strokeWidth="2" />
      <Path
        d="M7 8H8M16 8H17M8 16V17M17 16V17M12 8H13M12 12H13M12 16H13"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Rect x="16" y="16" width="3" height="3" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

