// src/components/animations/AttackAnimation.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/joy';

interface AttackAnimationProps {
    isVisible: boolean;
    onComplete?: () => void;
}

const AttackAnimation: React.FC<AttackAnimationProps> = ({ isVisible, onComplete }) => {
    return (
        <AnimatePresence onExitComplete={onComplete}>
            {isVisible && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: 'none',
                        zIndex: 9998,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {/* Main slash effect */}
                    <motion.div
                        initial={{
                            scale: 0,
                            rotate: -45,
                            opacity: 0,
                        }}
                        animate={{
                            scale: [0, 1.5, 2],
                            rotate: [-45, 0, 45],
                            opacity: [0, 1, 0],
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'absolute',
                            width: '200px',
                            height: '200px',
                            background: 'linear-gradient(45deg, #ff0000, #ff6b6b)',
                            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        }}
                    />
                    {/* Additional impact effects */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: [0, 1.2, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'absolute',
                            width: '100px',
                            height: '100px',
                            background: 'radial-gradient(circle, #ff6b6b 0%, transparent 70%)',
                        }}
                    />
                    {/* Particle effects */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                            animate={{
                                scale: [0, 1, 0.5],
                                x: [0, (Math.random() - 0.5) * 200],
                                y: [0, (Math.random() - 0.5) * 200],
                                opacity: [1, 0],
                            }}
                            transition={{ duration: 0.5 }}
                            style={{
                                position: 'absolute',
                                width: '10px',
                                height: '10px',
                                background: '#ff0000',
                                borderRadius: '50%',
                            }}
                        />
                    ))}
                </Box>
            )}
        </AnimatePresence>
    );
};

export default AttackAnimation;