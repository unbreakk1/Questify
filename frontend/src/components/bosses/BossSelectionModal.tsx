import React from 'react';
import {
    Box,
    Modal,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    CircularProgress
} from '@mui/material';
import {Boss, selectBoss} from '../../api/BossesAPI';

interface BossSelectionModalProps {
    open: boolean;
    onClose: () => void;
    bosses: Boss[];
    onBossSelected: (boss: Boss) => void;
    loading: boolean;
}

const BossSelectionModal: React.FC<BossSelectionModalProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   bosses,
                                                                   onBossSelected,
                                                                   loading
                                                               }) => {
    const handleSelectBoss = async (boss: Boss) => {
        try {
            await selectBoss(boss.id);
            onBossSelected(boss);
            onClose();
        } catch (error) {
            console.error('Failed to select boss:', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: 800,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2
            }}>
                <Typography variant="h5" mb={3}>Choose Your Next Challenge!</Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {bosses.map((boss) => (
                            <Grid item xs={12} sm={6} md={3} key={boss.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" gutterBottom>
                                            {boss.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            HP: {boss.maxHealth}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Level Req: {boss.levelRequirement}
                                        </Typography>
                                        <Typography variant="body2" color={boss.rare ? 'primary' : 'text.secondary'}>
                                            {boss.rare ? '⭐ Rare Boss' : 'Normal Boss'}
                                        </Typography>
                                        <Typography variant="body2" color="success.main">
                                            Rewards: {boss.rewards.xp}XP, {boss.rewards.gold}G
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={() => handleSelectBoss(boss)}
                                        >
                                            Challenge
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Modal>
    );
};

export default BossSelectionModal;