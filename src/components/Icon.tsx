import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../constants/colors';

export type IconName =
    | 'home'
    | 'diagnosis'
    | 'share'
    | 'user'
    | 'heart'
    | 'heart-outline'
    | 'share-alt'
    | 'comment'
    | 'refresh'
    | 'thumbs-up'
    | 'map'
    | 'camera'
    | 'nature'
    | 'culture'
    | 'food'
    | 'photo'
    | 'travel'
    | 'star'
    | 'bookmark'
    | 'settings'
    | 'logout'
    | 'arrow-right'
    | 'check'
    | 'link'
    | 'qr-code'
    | 'users'
    | 'sparkles';

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    style?: any;
}

const iconMap: Record<IconName, { library: any; iconName: string }> = {
    'home': { library: MaterialIcons, iconName: 'home' },
    'diagnosis': { library: MaterialIcons, iconName: 'assessment' },
    'share': { library: MaterialIcons, iconName: 'share' },
    'user': { library: MaterialIcons, iconName: 'person' },
    'heart': { library: MaterialIcons, iconName: 'favorite' },
    'heart-outline': { library: MaterialIcons, iconName: 'favorite-border' },
    'share-alt': { library: FontAwesome5, iconName: 'share-alt' },
    'comment': { library: MaterialIcons, iconName: 'comment' },
    'refresh': { library: MaterialIcons, iconName: 'refresh' },
    'thumbs-up': { library: MaterialIcons, iconName: 'thumb-up' },
    'map': { library: MaterialIcons, iconName: 'map' },
    'camera': { library: MaterialIcons, iconName: 'camera-alt' },
    'nature': { library: MaterialIcons, iconName: 'park' },
    'culture': { library: MaterialIcons, iconName: 'museum' },
    'food': { library: MaterialIcons, iconName: 'restaurant' },
    'photo': { library: MaterialIcons, iconName: 'photo-camera' },
    'travel': { library: MaterialIcons, iconName: 'flight' },
    'star': { library: MaterialIcons, iconName: 'star' },
    'bookmark': { library: MaterialIcons, iconName: 'bookmark' },
    'settings': { library: MaterialIcons, iconName: 'settings' },
    'logout': { library: MaterialIcons, iconName: 'exit-to-app' },
    'arrow-right': { library: MaterialIcons, iconName: 'arrow-forward' },
    'check': { library: MaterialIcons, iconName: 'check-circle' },
    'link': { library: MaterialIcons, iconName: 'link' },
    'qr-code': { library: MaterialIcons, iconName: 'qr-code-scanner' },
    'users': { library: MaterialIcons, iconName: 'people' },
    'sparkles': { library: MaterialIcons, iconName: 'whatshot' },
};

export default function Icon({
    name,
    size = 24,
    color = Colors.text,
    style
}: IconProps) {
    const iconConfig = iconMap[name];
    if (!iconConfig) {
        return null;
    }

    const IconComponent = iconConfig.library;
    return (
        <IconComponent
            name={iconConfig.iconName}
            size={size}
            color={color}
            style={style}
        />
    );
}

