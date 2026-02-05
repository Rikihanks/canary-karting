import React, { useState, useEffect } from 'react';

const CountUp = ({ end, duration = 1000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const startValue = 0;
        const endValue = parseInt(end) || 0;

        if (endValue === 0) {
            setCount(0);
            return;
        }

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentCount = Math.floor(progress * (endValue - startValue) + startValue);

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration]);

    return <>{count}</>;
};

export default CountUp;
