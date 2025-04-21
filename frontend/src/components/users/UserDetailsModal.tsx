import React, {useEffect, useState} from "react";
import {
    Modal,
    ModalDialog,
    Typography,
    LinearProgress,
    Box,
    CircularProgress,
    Stack,
    IconButton
} from "@mui/joy";
import {getUserInfo} from "../../utils/UserAPI";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarsIcon from '@mui/icons-material/Stars';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CloseIcon from '@mui/icons-material/Close';

const StatsBox: React.FC<{
    icon: React.ReactNode;
    value: number | string;
    label: string;
    color: string;
    glowColor: string;
}> = ({icon, value, label, color, glowColor}) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
            borderRadius: 'lg',
            padding: '12px 20px',
            border: `2px solid ${color}`,
            boxShadow: `0 0 10px ${glowColor}`,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 0 15px ${glowColor}`,
            },
        }}
    >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                    '0%, 100%': {transform: 'translateY(0)'},
                    '50%': {transform: 'translateY(-4px)'},
                },
            }}
        >
            {icon}
        </Box>
        <Box>
            <Typography level="title-lg" sx={{fontWeight: 'bold', textShadow: `0 0 5px ${glowColor}`}}>
                {value}
            </Typography>
            <Typography level="body-sm" sx={{opacity: 0.8}}>
                {label}
            </Typography>
        </Box>
    </Box>
);

interface UserDetailsModalProps
{
    open: boolean;
    onClose: () => void;
    username: string | undefined;
}


const UserDetailsModal: React.FC<UserDetailsModalProps> = ({open, onClose, username}) =>
{
    const [userDetails, setUserDetails] = useState<{
        level: number;
        experience: number;
        gold: number;
        badges: string[];
    } | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        if (!open || !username) return;
        const fetchDetails = async () =>
        {
            setLoading(true);
            try
            {
                const userInfo = await getUserInfo(username);
                setUserDetails(userInfo);
            } catch (error)
            {
                console.error("Failed to fetch user details:", error);
            } finally
            {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [open, username]);

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                variant="outlined"
                sx={{
                    minWidth: 400,
                    maxWidth: 500,
                    background: 'linear-gradient(135deg, var(--joy-palette-background-level1) 0%, var(--joy-palette-background-surface) 100%)',
                    border: '3px solid',
                    borderColor: 'primary.outlinedBorder',
                    borderRadius: 'lg',
                    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                    p: 3,
                }}
            >
                <Box sx={{position: 'absolute', right: 8, top: 8}}>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            '&:hover': {transform: 'rotate(90deg)'},
                            transition: 'transform 0.3s ease-in-out',
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                </Box>

                <Typography
                    level="h2"
                    sx={{
                        mb: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, var(--joy-palette-primary-400), var(--joy-palette-primary-600))',
                        backgroundClip: 'text',
                        color: 'transparent',
                        textShadow: '0 0 20px rgba(var(--joy-palette-primary-mainChannel) / 0.5)',
                    }}
                >
                    {username}'s Profile
                </Typography>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress size="lg"/>
                    </Box>
                ) : userDetails ? (
                    <Stack spacing={3}>
                        <Stack direction="row" spacing={2}>
                            <StatsBox
                                icon={<EmojiEventsIcon sx={{fontSize: '2rem', color: '#4CAF50'}}/>}
                                value={userDetails.level}
                                label="Level"
                                color="#4CAF50"
                                glowColor="rgba(76, 175, 80, 0.5)"
                            />
                            <StatsBox
                                icon={<MonetizationOnIcon sx={{fontSize: '2rem', color: '#FFD700'}}/>}
                                value={userDetails.gold}
                                label="Gold"
                                color="#FFD700"
                                glowColor="rgba(255, 215, 0, 0.5)"
                            />
                        </Stack>

                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, rgba(var(--joy-palette-primary-mainChannel) / 0.2) 0%, rgba(var(--joy-palette-primary-mainChannel) / 0.1) 100%)',
                                borderRadius: 'lg',
                                p: 2,
                                border: '2px solid',
                                borderColor: 'primary.outlinedBorder',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography level="title-md">Experience</Typography>
                                <Typography level="title-md">
                                    {userDetails.experience} / {100 * userDetails.level} XP
                                </Typography>
                            </Box>
                            <LinearProgress
                                determinate
                                value={(userDetails.experience / (100 * userDetails.level)) * 100}
                                sx={{
                                    '--LinearProgress-thickness': '12px',
                                    '--LinearProgress-radius': '6px',
                                    '--LinearProgress-progressRadius': '6px',
                                    background: 'rgba(0,0,0,0.2)',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                                        animation: 'shine 2s linear infinite',
                                    },
                                    '@keyframes shine': {
                                        from: { transform: 'translateX(-100%)' },
                                        to: { transform: 'translateX(100%)' },
                                    },
                                }}
                            />

                        </Box>

                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 100%)',
                                borderRadius: 'lg',
                                p: 2,
                                border: '2px solid',
                                borderColor: 'warning.outlinedBorder',
                            }}
                        >
                            <Typography
                                level="title-md"
                                startDecorator={<WorkspacePremiumIcon sx={{color: 'warning.300'}}/>}
                                sx={{mb: 2}}
                            >
                                Badges
                            </Typography>
                            {userDetails.badges.length > 0 ? (
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {userDetails.badges.map((badge, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                background: 'rgba(255,255,255,0.1)',
                                                borderRadius: 'md',
                                                padding: '4px 12px',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                            }}
                                        >
                                            <StarsIcon sx={{fontSize: 'sm', color: 'warning.300'}}/>
                                            <Typography level="body-sm">{badge}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography level="body-md" sx={{opacity: 0.7}}>
                                    No badges earned yet. Complete tasks to earn badges!
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                ) : (
                    <Typography level="body-lg" color="danger" textAlign="center">
                        Failed to load details. Try again.
                    </Typography>
                )}
            </ModalDialog>
        </Modal>
    );
};

export default UserDetailsModal;