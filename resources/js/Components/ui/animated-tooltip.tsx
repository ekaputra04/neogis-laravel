"use client";
import React, { useState } from "react";
import {
    motion,
    useTransform,
    AnimatePresence,
    useMotionValue,
    useSpring,
} from "motion/react";

export const AnimatedTooltip = ({
    items,
}: {
    items: {
        id: number;
        name: string;
        designation: string;
        image: string;
    }[];
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const springConfig = { stiffness: 100, damping: 5 };
    const x = useMotionValue(0); // going to set this value on mouse move
    // rotate the tooltip
    const rotate = useSpring(
        useTransform(x, [-100, 100], [-45, 45]),
        springConfig
    );
    // translate the tooltip
    const translateX = useSpring(
        useTransform(x, [-100, 100], [-50, 50]),
        springConfig
    );
    const handleMouseMove = (event: any) => {
        const halfWidth = event.target.offsetWidth / 2;
        x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
    };

    return (
        <>
            {items.map((item, idx) => (
                <div
                    className="group relative -mr-4"
                    key={item.name}
                    onMouseEnter={() => setHoveredIndex(item.id)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence mode="popLayout">
                        {hoveredIndex === item.id && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 10,
                                    },
                                }}
                                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                                style={{
                                    translateX: translateX,
                                    rotate: rotate,
                                    whiteSpace: "nowrap",
                                }}
                                className="-top-16 left-1/2 z-50 absolute flex flex-col justify-center items-center bg-black shadow-xl px-4 py-2 rounded-md text-xs -translate-x-1/2"
                            >
                                <div className="-bottom-px z-30 absolute inset-x-10 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-[20%] h-px" />
                                <div className="-bottom-px left-10 z-30 absolute bg-gradient-to-r from-transparent via-sky-500 to-transparent w-[40%] h-px" />
                                <div className="z-30 relative font-bold text-white text-base">
                                    {item.name}
                                </div>
                                <div className="text-white text-xs">
                                    {item.designation}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <img
                        onMouseMove={handleMouseMove}
                        height={100}
                        width={100}
                        src={item.image}
                        alt={item.name}
                        className="group-hover:z-30 relative bg-white !m-0 !p-0 border-2 border-white rounded-full w-14 h-14 object-cover object-top group-hover:scale-105 transition duration-500"
                    />
                </div>
            ))}
        </>
    );
};
