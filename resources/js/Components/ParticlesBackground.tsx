"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Particles } from "./magicui/particles";

export function ParticlesBackground() {
    const { resolvedTheme } = useTheme();
    const [color, setColor] = useState("#ffffff");

    useEffect(() => {
        setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
    }, [resolvedTheme]);

    return (
        <Particles
            className="z-0 absolute inset-0"
            quantity={100}
            ease={80}
            color={color}
            refresh
        />
    );
}
