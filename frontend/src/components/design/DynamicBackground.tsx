// src/components/DynamicBackground.tsx
import {keyframes} from '@emotion/react';
import {Box} from '@mui/joy';
import React, {useEffect, useState} from 'react';



// Define animations
const float = keyframes`
    0% {
        transform: translateY(0px) scale(1);
    }
    50% {
        transform: translateY(-10px) scale(1.05);
    }
    100% {
        transform: translateY(0px) scale(1);
    }
`;

const mysticalFog = keyframes`
    0% {
        background-position: 0 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
`;

const patterns = {
    enchantedForest: {
        background: `
            linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
            radial-gradient(
                circle at top right,
                rgba(97, 255, 189, 0.15) 0%,
                transparent 50%
            ),
            radial-gradient(
                circle at bottom left,
                rgba(147, 255, 202, 0.1) 0%,
                transparent 50%
            ),
            url('public/images/enchanted-forest-upscaled.png')`  // Note: path starts from public folder
        ,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',

        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0,255,170,0.05) 0%, rgba(0,0,0,0.1) 100%)',
            animation: `${mysticalFog} 15s ease infinite`,
            pointerEvents: 'none'
        }
    },
    darkCastle: {
        background: `
            linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)),
            radial-gradient(
                circle at center,
                rgba(88, 42, 255, 0.15) 0%,
                transparent 60%
            ),
            url('public/images/dark-castle-upscaled.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',

        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(31,18,77,0.2) 0%, rgba(0,0,0,0.3) 100%)',
            pointerEvents: 'none'
        }
    },
    dragonsLair: {
        background: `
            linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)),
            radial-gradient(
                circle at bottom right,
                rgba(255, 59, 0, 0.15) 0%,
                transparent 50%
            ),
            radial-gradient(
                circle at top left,
                rgba(255, 146, 0, 0.1) 0%,
                transparent 50%
            ),
            url('public/images/dragons-lair-upscaled.png')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,69,0,0.05) 0%, rgba(0,0,0,0.2) 100%)',
            animation: `${mysticalFog} 20s ease infinite`,
            pointerEvents: 'none'
        }
    }
};

interface DynamicBackgroundProps
{
    children: React.ReactNode;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({children}) =>
{
    const [currentPattern, setCurrentPattern] = useState<keyof typeof patterns>('darkCastle');
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            setIsTransitioning(true);
            setTimeout(() =>
            {
                const patternKeys = Object.keys(patterns) as Array<keyof typeof patterns>;
                const currentIndex = patternKeys.indexOf(currentPattern);
                const nextIndex = (currentIndex + 1) % patternKeys.length;
                setCurrentPattern(patternKeys[nextIndex]);
                setIsTransitioning(false);
            }, 1000);
        }, 30000); // Change pattern every 30 seconds

        return () => clearInterval(interval);
    }, [currentPattern]);

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
                ...patterns[currentPattern],
                transition: 'all 1s ease-in-out',
                opacity: isTransitioning ? 0.8 : 1,
            }}
        >
            {/* Floating Particles/Magical Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    '& > div': {
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        background: currentPattern === 'dragonsLair'
                            ? 'rgba(255, 146, 0, 0.3)'
                            : currentPattern === 'enchantedForest'
                                ? 'rgba(97, 255, 189, 0.3)'
                                : 'rgba(88, 42, 255, 0.3)',
                        borderRadius: '50%',
                        animation: `${float} 6s infinite`,
                    },
                }}
            >
                {[...Array(15)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${6 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default DynamicBackground;