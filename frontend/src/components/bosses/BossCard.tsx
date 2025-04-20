import React from 'react';
import { Box, Typography, LinearProgress, Card, CardContent, Stack } from '@mui/joy';
import { Boss } from '../../api/BossesAPI';

interface BossCardProps
{
    boss: Boss;
}

const BossCard: React.FC<BossCardProps> = ({ boss }) => {
    return (
        <Card
            variant="outlined"
            sx={{
                bgcolor: boss.rare ? 'warning.softBg' : 'background.surface',
                opacity: boss.defeated ? 0.6 : 1,
            }}
        >
            <CardContent>
                <Stack spacing={1}>
                    <Typography level="h4">{boss.name}</Typography>
                    <Typography level="body-sm">Level Requirement: {boss.levelRequirement}</Typography>
                    <Typography level="body-sm" color={boss.rare ? 'warning' : 'neutral'}>
                        {boss.rare ? '⭐ Rare Boss' : 'Normal Boss'}
                    </Typography>

                    {/* Health Bar */}
                    <Box>
                        <Typography level="body-sm">
                            Health: {boss.currentHealth}/{boss.maxHealth}
                        </Typography>
                        <LinearProgress
                            determinate
                            value={(boss.currentHealth / boss.maxHealth) * 100}
                            sx={{
                                '--LinearProgress-radius': '4px',
                                '--LinearProgress-thickness': '8px',
                            }}
                        />
                    </Box>

                    {/* Rewards Section */}
                    <Box>
                        <Typography level="body-sm">
                            Rewards: {boss.rewards.xp} XP, {boss.rewards.badge}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default BossCard;
