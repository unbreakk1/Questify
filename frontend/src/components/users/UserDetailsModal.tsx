import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Typography, LinearProgress, Box, CircularProgress } from "@mui/material";
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>User Details</DialogTitle>
            <DialogContent>
                {(() => {
                    if (loading) {
                        return <CircularProgress />;
                    }
                    if (userDetails) {
                        return (
                            <Box>
                                <Typography variant="h6">Level: {userDetails.level}</Typography>
                                <Box display="flex" alignItems="center">
                                    <MonetizationOnIcon sx={{ color: "#FFD700", mr: 1 }} /> {/* Gold coin icon */}
                                    <Typography variant="body1">
                                        {userDetails.gold} {/* Display gold value */}
                                    </Typography>
                                </Box>

                                <Typography>XP:</Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={(userDetails.xp % 100) / 100 * 100} // XP Progress Bar Calculation
                                    sx={{ my: 1 }}
                                />
                                <Typography>Badges:</Typography>
                                <Typography>{userDetails.badges.join(", ") || "No badges yet."}</Typography>
                            </Box>
                        );
                    }
                    return <Typography color="error">Failed to load details. Try again.</Typography>;
                })()}
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailsModal;