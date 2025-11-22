import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
}

export default function NatureIcon({ size = 24, color = '#111827' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 2C12 2 8 6 8 10C8 13.3137 10.6863 16 14 16C17.3137 16 20 13.3137 20 10C20 6 16 2 16 2"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12 2V22M12 22L8 18M12 22L16 18"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

