import {
    LayoutDashboard,
    ListPlus,
    Map,
    Pencil,
    PlusCircle,
    User,
} from "lucide-react";

export const sidebarData = {
    navMain: [
        {
            title: "Main Map",
            url: "/maps",
            items: [
                {
                    title: "Overview",
                    url: "/maps",
                    icon: <Map className="size-4" />,
                },
                {
                    title: "Master Data",
                    url: "/maps/master-data",
                    icon: <LayoutDashboard className="size-4" />,
                },
                // { title: "User Geolocation", url: "#" },
                // { title: "Route & Navigation", url: "#" },
                // { title: "Data Filtering", url: "#" },
            ],
        },
        {
            title: "Marker",
            url: "/maps/marker",
            items: [
                {
                    title: "Marker Overview",
                    url: "/maps/marker",
                    icon: <Map className="size-4" />,
                },
                {
                    title: "Marker Category",
                    url: "/maps/marker/add/category",
                    icon: <ListPlus className="size-4" />,
                },
                {
                    title: "Add Marker",
                    url: "/maps/marker/add",
                    icon: <PlusCircle className="size-4" />,
                },
                // {
                //     title: "Edit & Delete Marker",
                //     url: "/maps/marker/edit-delete",
                //     icon: <Pencil className="size-4" />,
                // },
            ],
        },
        {
            title: "Line",
            url: "/maps/line",
            items: [
                {
                    title: "Line Overview",
                    url: "/maps/line",
                    icon: <Map className="size-4" />,
                },
                {
                    title: "Add Line",
                    url: "/maps/line/add",
                    icon: <PlusCircle className="size-4" />,
                },
                // {
                //     title: "Edit & Delete Line",
                //     url: "/maps/line/edit-delete",
                //     icon: <Pencil className="size-4" />,
                // },
            ],
        },
        {
            title: "Rectangle",
            url: "/maps/rectangle",
            items: [
                {
                    title: "Rectangle Overview",
                    url: "/maps/rectangle",
                    icon: <Map className="size-4" />,
                },
                {
                    title: "Add Rectangle",
                    url: "/maps/rectangle/add",
                    icon: <PlusCircle className="size-4" />,
                },
                // {
                //     title: "Edit & Delete Rectangle",
                //     url: "/maps/rectangle/edit-delete",
                //     icon: <Pencil className="size-4" />,
                // },
            ],
        },
        {
            title: "Polygon",
            url: "/maps/polygon",
            items: [
                {
                    title: "Polygon Overview",
                    url: "/maps/polygon",
                    icon: <Map className="size-4" />,
                },
                {
                    title: "Add Polygon",
                    url: "/maps/polygon/add",
                    icon: <PlusCircle className="size-4" />,
                },
                // {
                //     title: "Edit & Delete Polygon",
                //     url: "/maps/polygon/edit-delete",
                //     icon: <Pencil className="size-4" />,
                // },
            ],
        },
        {
            title: "Circle",
            url: "/maps/circle",
            items: [
                {
                    title: "Circle Overview",
                    url: "/maps/circle",
                    icon: <Map className="size-4" />,
                },
                {
                    title: "Add Circle",
                    url: "/maps/circle/add",
                    icon: <PlusCircle className="size-4" />,
                },
                // {
                //     title: "Edit & Delete Circle",
                //     url: "/maps/circle/edit-delete",
                //     icon: <Pencil className="size-4" />,
                // },
            ],
        },
        // {
        //   title: "Map Layers",
        //   url: "#",
        //   items: [
        //     { title: "Infrastructure", url: "#" },
        //     { title: "Green Areas", url: "#" },
        //     { title: "Public Facilities", url: "#" },
        //     { title: "Administrative Boundaries", url: "#" },
        //   ],
        // },
        // {
        //   title: "Measurement Tools",
        //   url: "#",
        //   items: [
        //     { title: "Distance Between Points", url: "#" },
        //     { title: "Area Calculation", url: "#" },
        //     { title: "Data Statistics", url: "#" },
        //   ],
        // },
        // {
        //   title: "Location Data",
        //   url: "#",
        //   items: [
        //     { title: "Add Data", url: "#" },
        //     { title: "Edit Data", url: "#" },
        //     { title: "Delete Data", url: "#" },
        //     { title: "Import Data", url: "#" },
        //     { title: "Export Data", url: "#" },
        //   ],
        // },
        {
            title: "Profile",
            url: "/profile",
            items: [
                {
                    title: "Profile",
                    url: "/profile",
                    icon: <User className="size-4" />,
                },
            ],
        },
        // {
        //   title: "Settings",
        //   url: "#",
        //   items: [
        //     { title: "Theme", url: "#" },
        //     { title: "Base Map Selection", url: "#" },
        //     { title: "API & Integrations", url: "#" },
        //     { title: "Account Management", url: "#" },
        //   ],
        // },
        // {
        //   title: "Documentation & Help",
        //   url: "#",
        //   items: [
        //     { title: "User Guide", url: "#" },
        //     { title: "FAQ", url: "#" },
        //     { title: "Troubleshooting", url: "#" },
        //     { title: "Contact Support", url: "#" },
        //   ],
        // },
    ],
};
