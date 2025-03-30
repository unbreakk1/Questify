import React, {useState, useEffect} from "react";
import {Grid, Card, CardContent, Typography, Button, CircularProgress} from "@mui/material";

// Define the TypeScript interface for a Boss
interface Boss
{
    id: string;
    name: string;
    currentHealth: number;
    maxHealth: number;
    rare: boolean; // Indicates if this is a rare boss
}

// BossSelection Component
const BossSelection: React.FC = () =>
{
    const [bosses, setBosses] = useState<Boss[]>([]); // Store the fetched bosses
    const [loading, setLoading] = useState<boolean>(true); // Indicates if data is being fetched

    // Fetch bosses from the backend
    useEffect(() =>
    {
        const fetchBosses = async () =>
        {
            try
            {
                const response = await fetch("/api/bosses/selection?userId=admin");
                if (!response.ok)
                {
                    throw new Error("Failed to fetch bosses");
                }
                const data: Boss[] = await response.json();
                setBosses(data);
            } catch (error)
            {
                console.error("Error fetching bosses:", error);
            } finally
            {
                setLoading(false); // Stop loading once API call is done
            }
        };

        fetchBosses();
    }, []);

    // Handle user selecting a boss to fight
    const handleFight = async (bossId: string) =>
    {
        try
        {
            const response = await fetch(`/api/bosses/fight/${bossId}`, {
                method: "POST",
            });
            if (response.ok)
            {
                alert("Boss fight started!");
            } else
            {
                alert("Could not start boss fight. Try again.");
            }
        } catch (error)
        {
            console.error("Error starting boss fight:", error);
        }
    };

    return (
        <div style={{padding: "20px"}}>
            <Typography variant="h4" gutterBottom>
                Choose Your Boss
            </Typography>

            {loading ? (
                // Show a loader while fetching boss data
                <CircularProgress/>
            ) : bosses.length === 0 ? (
                // Inform the user if no bosses are available
                <Typography variant="body1">No bosses available at the moment.</Typography>
            ) : (
                // Display the list of bosses
                <Grid container spacing={3}>
                    {bosses.map((boss) => (
                        <Grid item xs={12} sm={6} md={3} key={boss.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {boss.name}
                                    </Typography>
                                    <Typography>
                                        Health: {boss.currentHealth} / {boss.maxHealth}
                                    </Typography>
                                    {boss.rare && (
                                        <Typography color="secondary" style={{fontWeight: "bold"}}>
                                            🌟 Rare Boss!
                                        </Typography>
                                    )}
                                </CardContent>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleFight(boss.id)}
                                >
                                    Fight {boss.name}
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default BossSelection;