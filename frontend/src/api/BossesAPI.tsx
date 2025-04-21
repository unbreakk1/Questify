import apiClient from './ApiClient'; // Centralized Axios client

export interface Boss
{
    id: string;
    name: string;
    maxHealth: number;
    currentHealth: number;
    levelRequirement: number;
    boss: Boss;
    message?: string;
    defeated: boolean;
    rare: boolean;
    rewards: {
        gold: number;
        xp: number;
        badge: string;
    };
}

export interface BossResponse
{
    id: string;
    name: string;
    maxHealth: number;
    currentHealth: number;
    levelRequirement: number;
    boss: Boss;
    message?: string;
    defeated: boolean;
    rare: boolean;
    rewards: {
        gold: number;
        xp: number;
        badge: string;
        hasCausedLevelUp?: boolean;
    };


}

// Fetch a selection of bosses based on user's level
export const getBossSelection = async (): Promise<Boss[]> =>
{
    const response = await apiClient.get('/api/boss/selection');
    return response.data; // Return list of bosses
};

// Select a specific boss for the fight
export const selectBoss = async (bossId: string): Promise<string> =>
{
    const response = await apiClient.post(`/api/boss/select/${bossId}`);
    return response.data; // Return success message
};

// Start the fight with a specific boss
export const startBossFight = async (bossId: string): Promise<string> =>
{
    const response = await apiClient.post(`/api/boss/fight/${bossId}`);
    return response.data; // Return success message
};

// Attack a boss with a specified amount of damage
export const attackBoss = async (damage: number): Promise<BossResponse> =>
{
    const response = await apiClient.put('/api/boss/attack', {damage});
    return response.data; // Return the updated boss and any related message
};

// Fetch the active boss for the user
export const getActiveBoss = async (): Promise<BossResponse> => {
    const response = await apiClient.get('/api/boss/active');
    return response.data; // Return the active boss
};
