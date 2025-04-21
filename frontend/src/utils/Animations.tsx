import { animate } from 'framer-motion';

export const createFloatingText = (text: string, x: number, y: number, color: string) => {
    // Create floating element
    const element = document.createElement('div');
    element.innerText = text;
    element.style.position = 'fixed';
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.color = color;
    element.style.fontWeight = 'bold';
    element.style.zIndex = '9999';
    element.style.pointerEvents = 'none';
    document.body.appendChild(element);

    // Animate and remove
    animate(
        element,
        {
            opacity: [1, 0],
            y: [y, y - 100],
            scale: [1, 1.2, 1],
        },
        {
            duration: 1.5,
            onComplete: () => element.remove(),
        }
    );
};

export const shakeElement = (element: HTMLElement) => {
    animate(
        element,
        { x: [0, -10, 10, -10, 10, 0] },
        { duration: 0.5 }
    );
};

export const pulseElement = (element: HTMLElement) => {
    animate(
        element,
        { scale: [1, 1.1, 1] },
        { duration: 0.3 }
    );
};