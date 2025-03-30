import React from 'react';
import { Card, CardContent, Typography, LinearProgress } from '@mui/material';

interface Boss
{
    name: string;
    levelRequirement: number;
    currentHealth: number;
    maxHealth: number;
    defeated: boolean;
}


const BossCard: React.FC<{ boss: Boss }> = ({ boss }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{boss.name}</Typography>
                <Typography color="text.secondary">Level Requirement: {boss.levelRequirement}</Typography>
                <LinearProgress variant="determinate" value={(boss.currentHealth / boss.maxHealth) * 100} />
                <Typography>{boss.defeated ? 'Defeated' : 'Alive'}</Typography>
            </CardContent>
        </Card>
    );
};

export default BossCard;