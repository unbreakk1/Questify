// src/components/bosses/AnimatedBossCard.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Typography, LinearProgress, Box } from '@mui/joy';
import { BossResponse } from '../../api/BossesAPI';
import React from "react";

interface AnimatedBossCardProps {
    boss: BossResponse;
    onAttack?: () => void;
}

const AnimatedBossCard: React.FC<AnimatedBossCardProps> = ({ boss }) => {
    const healthPercentage = (boss.currentHealth / boss.maxHealth) * 100;

    return (
        <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
        >
            <Card
                variant="outlined"
                sx={{
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography level="h4">{boss.name}</Typography>
                            <Typography level="body-lg">
                                HP: {boss.currentHealth}/{boss.maxHealth}
                            </Typography>
                        </Box>

                        <Box sx={{ position: 'relative', mb: 2 }}>
                            <LinearProgress
                                determinate
                                value={healthPercentage}
                                color="danger"
                                sx={{
                                    '--LinearProgress-thickness': '20px',
                                    '--LinearProgress-radius': '10px',
                                }}
                            />
                            <AnimatePresence>
                                {boss.currentHealth > 0 && (
                                    <motion.div
                                        initial={{ width: '100%' }}
                                        animate={{ width: `${healthPercentage}%` }}
                                        transition={{ type: 'spring', damping: 15 }}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: '100%',
                                            backgroundColor: 'var(--joy-palette-danger-500)',
                                            borderRadius: '10px',
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                        </Box>

                        <Typography level="body-sm" sx={{ fontStyle: 'italic' }}>
                            {boss.name}
                        </Typography>
                    </CardContent>
                </motion.div>
            </Card>
        </motion.div>
    );
};

export default AnimatedBossCard;