"use client"

import { useEffect, useState } from "react";

export type CountUpProps = {
    start: number;
    end: number;
    seconds: number;
    interval_time: number;
    delay: number;
}

export const CountUp = (props: CountUpProps) => {
    const [display_count, setDisplayCount] = useState<number>(props.start);
    const [time_passed, setTimePassed] = useState<number>(0);

    useEffect(() => {
        if (display_count >= props.end) {
            return;
        }

        setInterval(() => {
            setTimePassed(time_passed + props.interval_time);
            if (time_passed < props.delay) {
                return;
            }
            
            const add = Math.ceil((props.end - props.start) / (props.seconds / (props.interval_time)));
            setDisplayCount(display_count + add);
            if (display_count + add >= props.end) {
                setDisplayCount(props.end);
            }
        }, (props.interval_time * 1000));
    });

    return (
        <span>{display_count}</span>
    );
}