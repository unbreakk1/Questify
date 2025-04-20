import React, { useEffect, useState } from "react";
import {
    Modal,
    ModalDialog,
    ModalClose,
    Typography,
    LinearProgress,
    Box,
    CircularProgress,
    Stack,
    Divider
} from "@mui/joy";
import { getUserInfo } from "../../utils/UserAPI";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";


interface UserDetailsModalProps {
    open: boolean;
    onClose: () => void;
    username: string | undefined;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ open, onClose, username }) => {
    const [userDetails, setUserDetails] = useState<{
        level: number;
        xp: number;
        gold: number;
        badges: string[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!open || !username) return;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const userInfo = await getUserInfo(username);
                setUserDetails(userInfo); // Includes level, xp, gold, badges, etc.
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [open, username]);

    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <ModalDialog
                variant="outlined"
                sx={{
                    minWidth: 400,
                    maxWidth: 500,
                }}
            >
                <ModalClose />
                <Typography level="h4" mb={2}>
                    User Details
                </Typography>

                {(() => {
                    if (loading) {
                        return (
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                minHeight={200}
                            >
                                <CircularProgress />
                            </Box>
                        );
                    }

                    if (userDetails) {
                        const xpForNextLevel = 100 * userDetails.level;

                        return (
                            <Stack spacing={2}>
                                <Typography level="h3">
                                    Level: {userDetails.level}
                                </Typography>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                >
                                    <MonetizationOnIcon sx={{ color: "warning.300" }} />
                                    <Typography level="body-lg">
                                        {userDetails.gold}
                                    </Typography>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography level="title-sm" mb={1}>
                                        Experience Progress
                                    </Typography>

                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        mb={1}
                                    >
                                        <Typography level="body-sm">
                                            {userDetails.xp} XP
                                        </Typography>
                                        <Typography level="body-sm">
                                            {xpForNextLevel} XP
                                        </Typography>
                                    </Box>

                                    <LinearProgress
                                        determinate
                                        value={(userDetails.xp / xpForNextLevel) * 100}
                                        sx={{
                                            '--LinearProgress-thickness': '8px',
                                            '--LinearProgress-radius': '4px',
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Typography level="title-sm" mb={1}>
                                        Badges
                                    </Typography>
                                    <Typography level="body-md">
                                        {userDetails.badges.length > 0
                                            ? userDetails.badges.join(", ")
                                            : "No badges yet."}
                                    </Typography>
                                </Box>
                            </Stack>
                        );
                    }

                    return (
                        <Typography
                            level="body-lg"
                            color="danger"
                            textAlign="center"
                        >
                            Failed to load details. Try again.
                        </Typography>
                    );
                })()}
            </ModalDialog>
        </Modal>
    );
};

export default UserDetailsModal;
