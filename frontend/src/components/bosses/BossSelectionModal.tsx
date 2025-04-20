import React from 'react';
import {
    Modal,
    ModalDialog,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
    Box,
    Stack
} from '@mui/joy';
import {Boss, selectBoss} from '../../api/BossesAPI';

interface BossSelectionModalProps {
    open: boolean;
    onClose: () => void;
    bosses: Boss[];
    onBossSelected: (boss: Boss) => void;
    loading: boolean;
    requireSelection: boolean;
}

const BossSelectionModal: React.FC<BossSelectionModalProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   bosses,
                                                                   onBossSelected,
                                                                   loading,
                                                                   requireSelection = false,
                                                               }) => {
    const handleSelectBoss = async (boss: Boss) => {
        try {
            await selectBoss(boss.id);
            onBossSelected(boss);
            // Remove the onClose calls from here as they'll be handled by the parent
        } catch (error) {
            console.error('Failed to select boss:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={requireSelection ? undefined : onClose}
        >
            <ModalDialog
                sx={{
                    width: '80%',
                    maxWidth: 800,
                    p: 3,
                }}
            >
                <Typography level="h3" mb={2}>
                    Select Your Next Boss!
                </Typography>
                <Typography level="body-md" mb={3} color="neutral">
                    You must select a boss to continue your journey
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                        {bosses.map((boss) => (
                            <Grid xs={12} sm={6} md={3} key={boss.id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack spacing={1}>
                                            <Typography level="h4">
                                                {boss.name}
                                            </Typography>
                                            <Typography level="body-sm">
                                                HP: {boss.maxHealth}
                                            </Typography>
                                            <Typography level="body-sm">
                                                Level Req: {boss.levelRequirement}
                                            </Typography>
                                            <Typography
                                                level="body-sm"
                                                color={boss.rare ? 'warning' : 'neutral'}
                                            >
                                                {boss.rare ? '⭐ Rare Boss' : 'Normal Boss'}
                                            </Typography>
                                            <Typography level="body-sm" color="success">
                                                Rewards: {boss.rewards.xp}XP, {boss.rewards.gold}G
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            fullWidth
                                            onClick={() => handleSelectBoss(boss)}
                                            color="primary"
                                        >
                                            Challenge
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </ModalDialog>
        </Modal>
    );
};

export default BossSelectionModal;
