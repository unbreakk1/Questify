// src/components/animations/RewardAnimation.tsx
import {motion, AnimatePresence} from 'framer-motion';
import {Box, Typography} from '@mui/joy';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import React, {useEffect} from 'react';

interface RewardAnimationProps
{
    gold?: number;
    xp?: number;
    levelUp?: boolean;
    onComplete?: () => void;
}

const RewardAnimation: React.FC<RewardAnimationProps> = ({gold, xp, levelUp, onComplete}) =>
{
    useEffect(() =>
    {
        if (gold || xp || levelUp)
        {
            const timeout = setTimeout(() =>
            {
                if (onComplete) onComplete();
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [gold, xp, levelUp, onComplete]);

    return (
        <AnimatePresence>
            {(gold || xp || levelUp) && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'none',
                        zIndex: 9999,
                    }}
                >
                    <motion.div
                        initial={{scale: 0.5, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.5, opacity: 0}}
                        transition={{duration: 0.3}}
                    >
                        <Box sx={{textAlign: 'center'}}>
                            {gold && (
                                <motion.div
                                    initial={{y: 0, opacity: 0}}
                                    animate={{y: -50, opacity: 1}}
                                    exit={{y: -100, opacity: 0}}
                                    transition={{duration: 1.5}}
                                >
                                    <Typography
                                        level="h2"
                                        sx={{
                                            color: 'warning.300',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            textShadow: '0 0 10px rgba(255,215,0,0.5)',
                                        }}
                                    >
                                        <MonetizationOnIcon sx={{fontSize: 40}}/>
                                        +{gold}
                                    </Typography>
                                </motion.div>
                            )}

                            {xp && (
                                <motion.div
                                    initial={{y: 0, opacity: 0}}
                                    animate={{y: -50, opacity: 1}}
                                    exit={{y: -100, opacity: 0}}
                                    transition={{duration: 1.5, delay: 0.2}}
                                >
                                    <Typography
                                        level="h3"
                                        sx={{
                                            color: 'primary.300',
                                            mt: 1,
                                            textShadow: '0 0 10px rgba(64,196,255,0.5)',
                                        }}
                                    >
                                        +{xp} XP
                                    </Typography>
                                </motion.div>
                            )}

                            {levelUp && (
                                <motion.div
                                    initial={{scale: 0.5, opacity: 0}}
                                    animate={{
                                        scale: [0.5, 1.2, 1],
                                        opacity: [0, 1, 1]
                                    }}
                                    exit={{scale: 1.5, opacity: 0}}
                                    transition={{
                                        duration: 1,
                                        delay: 0.4
                                    }}
                                >
                                    <Typography
                                        level="h1"
                                        sx={{
                                            color: 'success.300',
                                            mt: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            textShadow: '0 0 20px rgba(50,255,50,0.5)',
                                        }}
                                    >
                                        <EmojiEventsIcon sx={{fontSize: 60}}/>
                                        LEVEL UP!
                                    </Typography>
                                </motion.div>
                            )}
                        </Box>
                    </motion.div>
                </Box>
            )}
        </AnimatePresence>
    );
};

export default RewardAnimation;