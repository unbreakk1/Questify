import React, { useState } from 'react';
import {
    Modal,
    ModalDialog,
    Typography,
    Grid,
    Button,
    CircularProgress,
    Box,
    Stack,
    Divider
} from '@mui/joy';
import { Boss, selectBoss } from '../../api/BossesAPI';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface BossSelectionModalProps {
    open: boolean;
    onClose: () => void;
    bosses: Boss[];
    onBossSelected: (boss: Boss) => void;
    loading: boolean;
    requireSelection: boolean;
}

const BossCard: React.FC<{
    boss: Boss;
    onSelect: (boss: Boss) => void;
}> = ({ boss, onSelect }) => (
    <Box
        sx={{
            background: boss.rare
                ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 152, 0, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(124, 77, 255, 0.15) 0%, rgba(124, 77, 255, 0.05) 100%)',
            borderRadius: 'lg',
            padding: '20px',
            border: '2px solid',
            borderColor: boss.rare ? 'warning.400' : 'primary.400',
            boxShadow: boss.rare
                ? '0 0 20px rgba(255, 215, 0, 0.3)'
                : '0 0 15px rgba(124, 77, 255, 0.3)',
            transition: 'all 0.3s ease-in-out',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: boss.rare
                    ? '0 0 30px rgba(255, 215, 0, 0.4)'
                    : '0 0 25px rgba(124, 77, 255, 0.4)',
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease-in-out',
                pointerEvents: 'none',
            },
            '&:hover::before': {
                opacity: 1,
            },
        }}
    >
        <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                    level="h4"
                    sx={{
                        color: boss.rare ? 'warning.400' : 'primary.400',
                        textShadow: boss.rare
                            ? '0 0 10px rgba(255, 215, 0, 0.5)'
                            : '0 0 10px rgba(124, 77, 255, 0.5)',
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

            <Stack direction="row" spacing={2} useFlexGap>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FavoriteIcon sx={{ color: 'danger.400' }} />
                    <Typography level="body-md">{boss.maxHealth} HP</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalFireDepartmentIcon sx={{ color: 'warning.400' }} />
                    <Typography level="body-md">Level {boss.levelRequirement}+</Typography>
                </Box>
            </Stack>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MonetizationOnIcon sx={{ color: 'warning.300' }} />
                        <Typography level="body-md">{boss.rewards.gold}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmojiEventsIcon sx={{ color: 'primary.300' }} />
                        <Typography level="body-md">{boss.rewards.xp} XP</Typography>
                    </Box>
                </Stack>
            </Box>

            <Button
                variant="solid"
                color={boss.rare ? "warning" : "primary"}
                onClick={() => onSelect(boss)}
                endDecorator="🗡️"
                sx={{
                    mt: 1,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    }
                }}
            >
                Challenge
            </Button>
        </Stack>
    </Box>
);

const BossSelectionModal: React.FC<BossSelectionModalProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   bosses,
                                                                   onBossSelected,
                                                                   loading,
                                                                   requireSelection = false,
                                                               }) => {
    const [error, setError] = useState<string | null>(null);

    const handleSelectBoss = async (boss: Boss) => {
        try {
            setError(null);
            await selectBoss(boss.id);
            onBossSelected(boss);
        } catch (error) {
            console.error('Failed to select boss:', error);
            setError('Failed to select boss. Please try again.');
        }
    };

    return (
        <Modal
            open={open}
            onClose={requireSelection ? undefined : onClose}
        >
            <ModalDialog
                sx={{
                    width: '90%',
                    maxWidth: 1000,
                    background: 'linear-gradient(135deg, var(--joy-palette-background-level1) 0%, var(--joy-palette-background-surface) 100%)',
                    border: '3px solid',
                    borderColor: 'primary.outlinedBorder',
                    borderRadius: 'lg',
                    boxShadow: 'lg',
                    p: 3,
                }}
            >
                <Typography
                    level="h2"
                    sx={{
                        textAlign: 'center',
                        mb: 1,
                        background: 'linear-gradient(45deg, var(--joy-palette-primary-400), var(--joy-palette-primary-600))',
                        backgroundClip: 'text',
                        color: 'transparent',
                        textShadow: '0 0 20px rgba(var(--joy-palette-primary-mainChannel) / 0.5)',
                    }}
                >
                    Choose Your Next Challenge!
                </Typography>

                <Typography
                    level="body-lg"
                    sx={{
                        textAlign: 'center',
                        mb: 3,
                        color: 'neutral.500'
                    }}
                >
                    Select a boss to continue your journey
                </Typography>

                {error && (
                    <Typography
                        level="body-lg"
                        color="danger"
                        sx={{ mt: 2, textAlign: 'center' }}
                    >
                        {error}
                    </Typography>
                )}

                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress size="lg" />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {bosses.map((boss) => (
                            <Grid xs={12} sm={6} md={4} key={boss.id}>
                                <BossCard boss={boss} onSelect={handleSelectBoss} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </ModalDialog>
        </Modal>
    );
};

export default BossSelectionModal;