import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { Boss } from '../../api/BossesAPI';

interface BossCardProps
{
    boss: Boss;
}

const BossCard: React.FC<BossCardProps> = ({ boss }) => {
    return (
        <Box
            sx={{
                padding: 2,
                margin: 2,
                border: '1px solid gray',
                borderRadius: 2,
                backgroundColor: boss.rare ? '#fff3cd' : '#f5f5f5', // Highlight rare bosses
                opacity: boss.defeated ? 0.6 : 1, // Dim defeated bosses
            }}
        >
            <Typography variant="h5">{boss.name}</Typography>
            <Typography variant="body1">Level Requirement: {boss.levelRequirement}</Typography>
            <Typography variant="body2" color="text.secondary">
                Rare: {boss.rare ? 'Yes' : 'No'}
            </Typography>

            {/* Health Bar */}
            <Box mt={1}>
                <Typography variant="body2">Health: {boss.currentHealth}/{boss.maxHealth}</Typography>
                <LinearProgress
                    variant="determinate"
                    value={(boss.currentHealth / boss.maxHealth) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                />
            </Box>

            {/* Rewards Section */}
            <Box mt={2}>
                <Typography variant="body2">
                    Rewards: {boss.rewards.xp} XP, {boss.rewards.badge}
                </Typography>
            </Box>
        </Box>
    );
};

export default BossCard;