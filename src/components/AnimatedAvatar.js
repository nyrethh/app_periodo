import React from 'react';
import { Droplet } from 'lucide-react';
import { AVATARS } from '../constants';

const AnimatedAvatar = ({ avatarType, mood, animationClass, theme }) => {
    const ChosenAvatar = AVATARS[avatarType];
    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            {mood === 'angry' && <div className="absolute inset-0 rounded-full animate-angry-glow"></div>}
            <ChosenAvatar size={40} className={`${theme.primaryIcon} ${animationClass} relative z-10`} />
            {mood === 'sad' && <Droplet size={16} className="absolute top-5 right-0 text-blue-400 fill-current animate-tear-drop z-20" />}
        </div>
    );
};

export default AnimatedAvatar;
