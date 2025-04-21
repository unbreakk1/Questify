import React from 'react';
import { Box, Typography, Stack } from '@mui/joy';
import { Boss } from '../../api/BossesAPI';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface BossCardProps {
    boss: Boss;
}

const BossCard: React.FC<BossCardProps> = ({ boss }) => {
    const healthPercentage = (boss.currentHealth / boss.maxHealth) * 100;

    return (
        <Box
            sx={{
                background: boss.rare
                    ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 152, 0, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(124, 77, 255, 0.15) 0%, rgba(124, 77, 255, 0.05) 100%)',
                borderRadius: 'lg',
                padding: '24px',
                border: '2px solid',
                borderColor: boss.rare ? 'warning.400' : 'primary.400',
                boxShadow: boss.rare
                    ? '0 0 20px rgba(255, 215, 0, 0.3)'
                    : '0 0 15px rgba(124, 77, 255, 0.3)',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                overflow: 'hidden',
                opacity: boss.defeated ? 0.6 : 1,
                filter: boss.defeated ? 'grayscale(50%)' : 'none',
            }}
        >
            <Stack spacing={3}>
                {/* Boss Name and Rarity Badge */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                        level="h3"
                        sx={{
                            color: boss.rare ? 'warning.400' : 'primary.400',
                            textShadow: boss.rare
                                ? '0 0 10px rgba(255, 215, 0, 0.5)'
                                : '0 0 10px rgba(124, 77, 255, 0.5)',
                            animation: 'pulse 2s ease-in-out infinite',
                            '@keyframes pulse': {
                                '0%, 100%': { opacity: 0.8 },
                                '50%': { opacity: 1 },
                            },
                        }}
                    >
                        {boss.name}
                    </Typography>
                    {boss.rare && (
                        <WorkspacePremiumIcon
                            sx={{
                                color: 'warning.400',
                                fontSize: 'xl2',
                                animation: 'shine 2s ease-in-out infinite',
                                '@keyframes shine': {
                                    '0%, 100%': { opacity: 0.5 },
                                    '50%': { opacity: 1 },
                                },
                            }}
                        />
                    )}
                </Box>

                {/* Health Bar */}
                <Box sx={{ position: 'relative' }}>
                    <Box
                        sx={{
                            height: '24px',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: 'md',
                            overflow: 'hidden',
                            border: '2px solid',
                            borderColor: 'danger.400',
                            position: 'relative',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: `${healthPercentage}%`,
                                background: 'linear-gradient(90deg, var(--joy-palette-danger-600) 0%, var(--joy-palette-danger-500) 100%)',
                                transition: 'width 0.5s ease-in-out',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                                    animation: 'shine 2s linear infinite',
                                    '@keyframes shine': {
                                        '0%': { transform: 'translateX(-100%)' },
                                        '100%': { transform: 'translateX(100%)' },
                                    },
                                },
                            }}
                        />
                        <Typography
                            level="body-md"
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                textAlign: 'center',
                                color: 'white',
                                textShadow: '0 0 4px rgba(0,0,0,0.5)',
                                lineHeight: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                            }}
                        >
                            <FavoriteIcon sx={{ fontSize: 'sm' }} />
                            {boss.currentHealth}/{boss.maxHealth}
                        </Typography>
                    </Box>
                </Box>

                {/* Boss Stats */}
                <Stack direction="row" spacing={2} useFlexGap>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        padding: '4px 12px',
                        borderRadius: 'md',
                        background: 'rgba(0,0,0,0.1)',
                    }}>
                        <LocalFireDepartmentIcon sx={{ color: 'warning.400' }} />
                        <Typography level="body-md">Level {boss.levelRequirement}+</Typography>
                    </Box>
                </Stack>

                {/* Rewards */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        p: 2,
                        borderRadius: 'md',
                        background: 'rgba(0,0,0,0.1)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MonetizationOnIcon sx={{ color: 'warning.300' }} />
                        <Typography level="body-md">{boss.rewards.gold} Gold</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmojiEventsIcon sx={{ color: 'primary.300' }} />
                        <Typography level="body-md">{boss.rewards.xp} XP</Typography>
                    </Box>
                </Box>

                {boss.defeated && (
                    <Typography
                        level="h4"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(-30deg)',
                            color: 'danger.500',
                            border: '4px solid',
                            borderColor: 'danger.500',
                            padding: '4px 20px',
                            borderRadius: 'md',
                            textTransform: 'uppercase',
                            animation: 'defeated 0.5s ease-in-out',
                            '@keyframes defeated': {
                                '0%': { opacity: 0, transform: 'translate(-50%, -50%) rotate(-45deg) scale(0)' },
                                '100%': { opacity: 1, transform: 'translate(-50%, -50%) rotate(-30deg) scale(1)' },
                            },
                        }}
                    >
                        Defeated
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default BossCard;