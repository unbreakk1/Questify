// UserInfoCard.tsx
import React, {useState} from 'react';
import {Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';

interface User
{
    username: string;
    xp: number;
    gold: number;
    level: number;
}

interface UserInfoCardProps
{
    user: User;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({user}) =>
{
    const {username, xp, gold, level} = user;

    const [openDetails, setOpenDetails] = useState(false);

    const handleDetails = () =>
    {
        setOpenDetails(!openDetails);
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h5">{username}</Typography>
                    <Typography>Level: {level}</Typography>
                    <Typography>XP: {xp}</Typography>
                    <Typography>Gold: {gold}</Typography>
                    <Button variant="outlined" onClick={handleDetails}>
                        View Details
                    </Button>
                </CardContent>
            </Card>
            <Dialog open={openDetails} onClose={handleDetails}>
                <DialogTitle>{username}'s Detailed Stats</DialogTitle>
                <DialogContent>
                    <Typography>Level: {level}</Typography>
                    <Typography>XP: {xp}</Typography>
                    <Typography>Gold: {gold}</Typography>
                    {/* Add more detailed stats here */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetails} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default UserInfoCard;