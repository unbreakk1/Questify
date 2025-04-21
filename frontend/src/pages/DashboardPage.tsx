import React, {useState, useEffect} from "react";
import {
    CssBaseline,
    GlobalStyles,
    Box,
    Typography,
    Modal,
    Button,
    IconButton,
    Sheet,
    Stack,
    CircularProgress,
} from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import {getUsernameFromToken, getUserInfo} from "../utils/UserAPI.tsx";
import UserDetailsModal from "../components/users/UserDetailsModal.tsx";
import HabitForm from "../components/habits/HabitForm";
import TaskForm from "../components/tasks/TaskForm";
import TaskCard from "../components/tasks/TaskCard";
import HabitCard from "../components/habits/HabitCard";
import {getAllTasks, completeTask, deleteTask, Task} from "../api/TasksAPI";
import {getAllHabits, completeHabit, deleteHabit, Habit} from "../api/HabitsAPI";
import {getActiveBoss, attackBoss, BossResponse, getBossSelection, Boss} from "../api/BossesAPI";
import BossSelectionModal from '../components/bosses/BossSelectionModal';
import AttackAnimation from '../components/animations/AttackAnimation';
import RewardAnimation from '../components/animations/RewardAnimation';
import AnimatedBossCard from '../components/bosses/AnimatedBossCard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';



interface UserStatsUpdate
{
    userId: string;
    gold: number;
    level: number;
}

// Header Component
const StatsBox: React.FC<{
    icon: React.ReactNode;
    value: number;
    color: string;
    glowColor: string;
}> = ({ icon, value, color, glowColor }) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
            borderRadius: 'md',
            padding: '4px 12px',
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
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' },
                },
            }}
        >
            {icon}
        </Box>
        <Typography
            level="title-lg"
            sx={{
                fontWeight: 'bold',
                textShadow: `0 0 5px ${glowColor}`,
            }}
        >
            {value}
        </Typography>
    </Box>
);

const Header: React.FC<{
    userStats: { username: string; gold: number; level: number } | null;
    loading: boolean;
    onUserClick: () => void;
    onLogout: () => void;
}> = ({ userStats, loading, onUserClick, onLogout }) => (
    <Sheet
        component="header"
        variant="solid"
        invertedColors
        sx={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 9999,
            p: 2,
            background: 'linear-gradient(45deg, var(--joy-palette-primary-900), var(--joy-palette-primary-800))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid',
            borderColor: 'primary.outlinedBorder',
        }}
    >
        <Typography level="h4">
            Questify Dashboard
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
            {loading ? (
                <CircularProgress size="sm" />
            ) : userStats ? (
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography
                        level="title-lg"
                        sx={{
                            cursor: "pointer",
                            position: 'relative',
                            '&:hover::after': {
                                width: '100%',
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -2,
                                left: 0,
                                width: '0%',
                                height: '2px',
                                backgroundColor: 'primary.300',
                                transition: 'width 0.3s ease-in-out',
                            },
                        }}
                        onClick={onUserClick}
                    >
                        {userStats.username}
                    </Typography>

                    <StatsBox
                        icon={<MonetizationOnIcon sx={{
                            color: 'warning.300',
                            fontSize: '1.5rem',
                        }} />}
                        value={userStats.gold}
                        color="#FFD700"
                        glowColor="rgba(255, 215, 0, 0.5)"
                    />

                    <StatsBox
                        icon={<EmojiEventsIcon sx={{
                            color: 'primary.300',
                            fontSize: '1.5rem',
                        }} />}
                        value={userStats.level}
                        color="#4CAF50"
                        glowColor="rgba(76, 175, 80, 0.5)"
                    />
                </Stack>
            ) : (
                <Typography level="body-md" color="danger">
                    Failed to load user stats
                </Typography>
            )}
            <Button
                variant="soft"
                color="neutral"
                onClick={onLogout}
                sx={{
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    },
                }}
            >
                Logout
            </Button>
        </Box>
    </Sheet>
);


// Main Content
const ContentSection: React.FC<{
    title: string;
    onAdd: () => void;
    children: React.ReactNode;
}> = ({title, onAdd, children}) => (
    <Sheet
        variant="outlined"
        sx={{
            flex: 1,
            p: 2,
            borderRadius: 'md',
            background: 'var(--joy-palette-background-level1)',
        }}
    >
        <Stack spacing={2}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography level="h4">{title}</Typography>
                <IconButton
                    variant="soft"
                    color="primary"
                    onClick={onAdd}
                    size="sm"
                >
                    <AddIcon/>
                </IconButton>
            </Box>
            <Stack spacing={1}>
                {children}
            </Stack>
        </Stack>
    </Sheet>
);

const DashboardPage: React.FC = () =>
{
    const [tasks, setTasks] = useState<Task[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [openModal, setOpenModal] = useState<"task" | "habit" | null>(null);
    const [userStats, setUserStats] = useState<{ username: string; gold: number; level: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [openUserModal, setOpenUserModal] = useState(false);
    const [boss, setBoss] = useState<BossResponse | null>(null); // Store current boss
    const [loadingBoss, setLoadingBoss] = useState(true); // Track boss loading state
    const [showBossSelection, setShowBossSelection] = useState(false);
    const [availableBosses, setAvailableBosses] = useState<Boss[]>([]);
    const [loadingBossSelection, setLoadingBossSelection] = useState(false);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [showAttackAnimation, setShowAttackAnimation] = useState(false);
    const [rewardAnimation, setRewardAnimation] = useState<{
        gold?: number;
        xp?: number;
        levelUp?: boolean;
    } | null>(null);


    useEffect(() =>
    {
        // Initialize WebSocket connection
        const initializeWebSocket = () =>
        {
            const client = new Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws', null, {
                    transports: ['websocket', 'xhr-streaming', 'xhr-polling']
                }),
                onConnect: () =>
                {
                    console.log('WebSocket Connected!');
                    const username = getUsernameFromToken();
                    if (username)
                    {
                        client.subscribe(`/topic/user-stats/${username}`, (message) =>
                        {
                            const update: UserStatsUpdate = JSON.parse(message.body);
                            setUserStats(prevStats =>
                            {
                                const isLevelUp = prevStats && update.level > prevStats.level;
                                if (isLevelUp)
                                {
                                    setRewardAnimation({
                                        gold: update.gold - (prevStats?.gold || 0),
                                        xp: 100, // Assuming XP gain, adjust as needed
                                        levelUp: true
                                    });
                                }
                                return {
                                    ...prevStats!,
                                    gold: update.gold,
                                    level: update.level
                                };
                            });
                        });
                    }
                },
                onStompError: (frame) =>
                {
                    console.error('WebSocket Error:', frame);
                }
            });

            client.activate();
            setStompClient(client);
        };


        // Fetch initial data
        const fetchData = async () =>
        {
            const tasksData = await getAllTasks();
            const habitsData = await getAllHabits();
            setTasks(tasksData);
            setHabits(habitsData);

            try
            {
                const activeBoss = await getActiveBoss();
                setBoss(activeBoss);
            } catch (error: Error | unknown)
            {
                const err = error as { response?: { data?: string } };
                if (err?.response?.data === "NO_ACTIVE_BOSS")
                {
                    const bosses = await getBossSelection();
                    setAvailableBosses(bosses);
                    setShowBossSelection(true);
                } else
                {
                    console.error("Error fetching active boss:", error);
                }
            }

            const username = getUsernameFromToken();
            if (!username)
            {
                console.error("Username not found in token.");
                return;
            }

            try
            {
                const userInfo = await getUserInfo(username);
                setUserStats({
                    username: userInfo.username,
                    gold: userInfo.gold,
                    level: userInfo.level,
                });
            } catch (error)
            {
                console.error("Failed to fetch user stats:", error);
            } finally
            {
                setLoading(false);
                setLoadingBoss(false);
            }
        };

        initializeWebSocket();
        fetchData();

        // Cleanup WebSocket connection when component unmounts
        return () =>
        {
            if (stompClient)
            {
                stompClient.deactivate();
            }
        };
    }, []);

    const handleBossDefeat = async () =>
    {
        setLoadingBossSelection(true);
        try
        {
            const bosses = await getBossSelection();
            setAvailableBosses(bosses);
            setBoss(null); // Clear the current boss when defeated
            setShowBossSelection(true);
        } catch (error)
        {
            console.error('Failed to fetch boss selection:', error);
        } finally
        {
            setLoadingBossSelection(false);
        }
    };

    const handleCompleteTask = async (taskId: string) =>
        {
            try
            {
                await completeTask(taskId);
                const updatedTasks = await getAllTasks();
                setTasks(updatedTasks);


                if (boss)
                {
                    setShowAttackAnimation(true);
                    const updatedBoss = await attackBoss(500);
                    setBoss(updatedBoss);

                    if (updatedBoss.currentHealth === 0)
                    {
                        setTimeout(() =>
                        {
                            handleBossDefeat();
                        }, 1000);
                    }
                }
            } catch
                (error)
            {
                console.error("Failed to complete task or process boss damage:", error);
            }
        }
    ;

    const handleDeleteTask = async (taskId: string) =>
    {
        await deleteTask(taskId);
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    const handleCompleteHabit = async (habitId: string) =>
    {
        try
        {
            await completeHabit(habitId);
            const updatedHabits = await getAllHabits();
            setHabits(updatedHabits);
            if (boss)
            {
                setShowAttackAnimation(true);
                const updatedBossResponse = await attackBoss(750); // Example: Completing habit deals 5 damage
                setBoss(updatedBossResponse);


                if (updatedBossResponse.currentHealth === 0)
                {
                    await handleBossDefeat();
                }
            }
        } catch (error)
        {
            console.error("Failed to complete habit or process boss damage:", error);
        }
    };

    const handleDeleteHabit = async (habitId: string) =>
    {
        await deleteHabit(habitId);
        setHabits(habits.filter((habit) => habit.id !== habitId));
    };

    const handleLogout = () =>
    {
        if (stompClient)
        {
            stompClient.deactivate();
        }

        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <CssBaseline/>
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Header-height': '64px',
                    },
                }}
            />

            <Header
                userStats={userStats}
                loading={loading}
                onUserClick={() => setOpenUserModal(true)}
                onLogout={handleLogout}
            />

            <Box
                component="main"
                sx={{
                    mt: 'var(--Header-height)',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    boxSizing: 'border-box',
                    minHeight: 'calc(100vh - var(--Header-height))',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Boss Section with AnimatedBossCard */}
                <Sheet
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderRadius: 'md',
                        background: 'var(--joy-palette-background-level1)',
                        width: '100%',
                        mb: 2,
                    }}
                >
                    <Typography level="h4" mb={2}>
                        Active Boss
                    </Typography>
                    {loadingBoss ? (
                        <CircularProgress/>
                    ) : boss ? (
                        <AnimatedBossCard boss={boss}/>
                    ) : (
                        <Typography level="body-md">
                            No active boss! Complete tasks or habits to summon one!
                        </Typography>
                    )}
                </Sheet>

                {/* Tasks and Habits Section */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        width: '100%',
                    }}
                >
                    <ContentSection
                        title="Tasks"
                        onAdd={() => setOpenModal("task")}
                    >
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                {...task}
                                onComplete={handleCompleteTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </ContentSection>

                    <ContentSection
                        title="Habits"
                        onAdd={() => setOpenModal("habit")}
                    >
                        {habits.map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                onComplete={handleCompleteHabit}
                                onDelete={handleDeleteHabit}
                                onReset={async (habitId) =>
                                {
                                    await completeHabit(habitId);
                                    const updatedHabits = await getAllHabits();
                                    setHabits(updatedHabits);
                                }}
                            />
                        ))}
                    </ContentSection>
                </Box>
            </Box>

            {/* Modals */}
            <UserDetailsModal
                open={openUserModal}
                onClose={() => setOpenUserModal(false)}
                username={userStats?.username}
            />

            <BossSelectionModal
                open={showBossSelection}
                onClose={() => setShowBossSelection(false)}
                bosses={availableBosses}
                onBossSelected={async () =>
                {
                    try
                    {
                        const refreshedBoss = await getActiveBoss();
                        setBoss(refreshedBoss);
                        setShowBossSelection(false);
                    } catch (error)
                    {
                        console.error('Failed to get active boss:', error);
                    }
                }}
                loading={loadingBossSelection}
                requireSelection={!boss}
            />

            <Modal
                open={Boolean(openModal)}
                onClose={() => setOpenModal(null)}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        p: 3,
                        borderRadius: 'md',
                        boxShadow: 'lg',
                    }}
                >
                    {openModal === "task" ? (
                        <TaskForm
                            onTaskCreated={async () =>
                            {
                                const updatedTasks = await getAllTasks();
                                setTasks(updatedTasks);
                                setOpenModal(null);
                            }}
                        />
                    ) : (
                        <HabitForm
                            onHabitCreated={async () =>
                            {
                                const updatedHabits = await getAllHabits();
                                setHabits(updatedHabits);
                                setOpenModal(null);
                            }}
                        />
                    )}
                </Sheet>
            </Modal>

            {/* Animation Components */}
            <AttackAnimation
                isVisible={showAttackAnimation}
                onComplete={() => setShowAttackAnimation(false)}
            />

            <RewardAnimation
                {...rewardAnimation}
                onComplete={() => setRewardAnimation(null)}
            />
        </Box>
    );
};

export default DashboardPage;
