import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Box } from '@mui/joy';
import { BossResponse } from '../../api/BossesAPI';
import React from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface AnimatedBossCardProps {
    boss: BossResponse;
    onAttack?: () => void;
}

const AnimatedBossCard: React.FC<AnimatedBossCardProps> = ({ boss }) => {
    const healthPercentage = (boss.currentHealth / boss.maxHealth) * 100;

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Box
                sx={{
                    background: boss.rare
                        ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 152, 0, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(124, 77, 255, 0.15) 0%, rgba(124, 77, 255, 0.05) 100%)',
                    borderRadius: 'xl',
                    padding: '32px',
                    border: '3px solid',
                    borderColor: boss.rare ? 'warning.400' : 'primary.400',
                    boxShadow: boss.rare
                        ? '0 0 30px rgba(255, 215, 0, 0.3)'
                        : '0 0 25px rgba(124, 77, 255, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Boss Header */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography
                                level="h2"
                                sx={{
                                    color: boss.rare ? 'warning.400' : 'primary.400',
                                    textShadow: boss.rare
                                        ? '0 0 15px rgba(255, 215, 0, 0.5)'
                                        : '0 0 15px rgba(124, 77, 255, 0.5)',
                                }}
                            >
                                {boss.name}
                            </Typography>
                            {boss.rare && (
                                <WorkspacePremiumIcon
                                    sx={{
                                        color: 'warning.400',
                                        fontSize: '2rem',
                                        animation: 'shine 2s ease-in-out infinite',
                                        '@keyframes shine': {
                                            '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
                                            '50%': { opacity: 1, transform: 'scale(1.1)' },
                                        },
                                    }}
                                />
                            )}
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 1,
                            borderRadius: 'md',
                            background: 'rgba(0,0,0,0.2)',
                        }}>
                            <LocalFireDepartmentIcon sx={{ color: 'warning.400' }} />
                            <Typography level="title-lg">
                                Level {boss.levelRequirement}+
                            </Typography>
                        </Box>
                    </Box>

                    {/* Health Bar */}
                    <Box sx={{ position: 'relative', mb: 2 }}>
                        <Box sx={{
                            height: '32px',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: 'xl',
                            overflow: 'hidden',
                            border: '2px solid',
                            borderColor: 'danger.500',
                            position: 'relative',
                        }}>
                            <AnimatePresence>
                                <motion.div
                                    initial={{ width: '100%' }}
                                    animate={{ width: `${healthPercentage}%` }}
                                    transition={{ type: 'spring', damping: 15 }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, var(--joy-palette-danger-600) 0%, var(--joy-palette-danger-500) 100%)',
                                    }}
                                >
                                    <motion.div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                                        }}
                                        animate={{
                                            x: ['-100%', '100%'],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }}
                                    />
                                </motion.div>
                            </AnimatePresence>
                            <Box sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                            }}>
                                <FavoriteIcon sx={{
                                    color: 'white',
                                    animation: healthPercentage < 30 ? 'pulse 1s ease-in-out infinite' : 'none',
                                    '@keyframes pulse': {
                                        '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                                        '50%': { opacity: 0.7, transform: 'scale(0.95)' },
                                    },
                                }} />
                                <Typography
                                    level="title-lg"
                                    sx={{
                                        color: 'white',
                                        textShadow: '0 0 4px rgba(0,0,0,0.5)',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {boss.currentHealth}/{boss.maxHealth}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Background Effects */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            pointerEvents: 'none',
                            background: `radial-gradient(circle at 50% 50%, ${boss.rare ? 'rgba(255, 215, 0, 0.1)' : 'rgba(124, 77, 255, 0.1)'} 0%, transparent 70%)`,
                        }}
                    />
                </motion.div>
            </Box>
        </motion.div>
    );
};

export default AnimatedBossCard;