import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
}

export default function RefreshIcon({ size = 24, color = '#111827' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M1 4V10H7M23 20V14H17"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M20.49 9C19.8413 7.21913 18.7783 5.63891 17.3922 4.39278C16.0061 3.14665 14.3394 2.27249 12.5442 1.85011C10.749 1.42773 8.87658 1.46941 7.09926 1.97157C5.32194 2.47373 3.69159 3.42189 2.35 4.73L1 6M23 18L21.65 19.27C20.3084 20.5781 18.6781 21.5263 16.9007 22.0284C15.1234 22.5306 13.251 22.5723 11.4558 22.1499C9.66057 21.7275 7.99393 20.8534 6.60782 19.6072C5.22171 18.3611 4.15868 16.7809 3.51 15"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

