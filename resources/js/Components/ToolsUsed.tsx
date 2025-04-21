import { AnimatedTooltip } from "./ui/animated-tooltip";
import reactLeafletImage from "@/images/logo/leaflet.png";
import shadcnUIImage from "@/images/logo/shadcn-ui.png";
import magicUIImage from "@/images/logo/magic-ui.png";
import laravelImage from "@/images/logo/laravel.png";
import mySQLImage from "@/images/logo/mysql.png";
import inertiaImage from "@/images/logo/inertia.png";
import reactImage from "@/images/logo/react.png";

const tools = [
    {
        id: 1,
        name: "Laravel",
        designation: "Backend Framework",
        image: laravelImage,
    },
    {
        id: 2,
        name: "InertiaJS",
        designation: "Frontend-backend connector for SPAs",
        image: inertiaImage,
    },
    {
        id: 3,
        name: "ReactJS",
        designation: "Frontend Library",
        image: reactImage,
    },
    {
        id: 4,
        name: "MySQL",
        designation: "Relational Database",
        image: mySQLImage,
    },
    {
        id: 5,
        name: "React Leaflet",
        designation: "Map Library",
        image: reactLeafletImage,
    },
    {
        id: 6,
        name: "Shadcn UI",
        designation: "UI Components",
        image: shadcnUIImage,
    },
    {
        id: 7,
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
