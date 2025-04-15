"use client";
import React from "react";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import nextJSImage from "@/images/logo/nextjs.png";
import supabaseImage from "@/images/logo/supabase.png";
import reactLeafletImage from "@/images/logo/leaflet.png";
import shadcnUIImage from "@/images/logo/shadcn-ui.png";
import magicUIImage from "@/images/logo/magic-ui.png";

const tools = [
    {
        id: 1,
        name: "Next JS",
        designation: "Full-Stack Framework",
        image: nextJSImage,
    },
    {
        id: 2,
        name: "Supabase",
        designation: "Database as a Service",
        image: supabaseImage,
    },
    {
        id: 3,
        name: "React Leaflet",
        designation: "Map Library",
        image: reactLeafletImage,
    },
    {
        id: 4,
        name: "Shadcn UI",
        designation: "UI Components",
        image: shadcnUIImage,
    },
    {
        id: 5,
        name: "Magic UI",
        designation: "UI Components",
        image: magicUIImage,
    },
];

export function ToolsUsed() {
    return (
        <div className="flex flex-row justify-center items-center mb-10 w-full">
            <AnimatedTooltip items={tools} />
        </div>
    );
}
