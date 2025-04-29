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
            url: "/dashboard",
            items: [
                {
                    title: "Overview",
                    url: "/dashboard",
                    icon: <Map className="size-4" />,
                },
                // {
                //     title: "Master Data",
                //     url: "/dashboard/master-data",
                //     icon: <LayoutDashboard className="size-4" />,
                // },
                // { title: "User Geolocation", url: "#" },
                // { title: "Route & Navigation", url: "#" },
                // { title: "Data Filtering", url: "#" },
            ],
        },
        {
            title: "Marker",
            url: "/dashboard/marker",
            items: [
                {
                    title: "Marker Overview",
                    url: "/dashboard/marker",
                    icon: <Map className="size-4" />,
                },
                {
                    title: "Marker Category",
                    url: "/dashboard/marker/categories",
                    icon: <ListPlus className="size-4" />,
                },
                {
                    title: "Add Marker",
                    url: "/dashboard/marker/add",
                    icon: <PlusCircle className="size-4" />,
                },
                // {
                //     title: "Edit & Delete Marker",
                //     url: "/dashboard/marker/edit-delete",
                //     icon: <Pencil className="size-4" />,
                // },
            ],
        },
        {
            title: "Line",
            url: "/dashboard/line",
            items: [
                {
                    title: "Line Overview",
                    url: "/dashboard/line",
                    icon: <Map className="size-4" />,
                },
                {
                    title: "Line Category",
                    url: "/dashboard/line/categories",
                    icon: <ListPlus className="size-4" />,
                },
                {
                    title: "Add Line",
                    url: "/dashboard/line/add",
                    icon: <PlusCircle className="size-4" />,
                },
                // {
                //     title: "Edit & Delete Line",
                //     url: "/dashboard/line/edit-delete",
                //     icon: <Pencil className="size-4" />,
                // },
            ],
        },
        // {
        //     title: "Rectangle",
        //     url: "/dashboard/rectangle",
        //     items: [
        //         {
        //             title: "Rectangle Overview",
        //             url: "/dashboard/rectangle",
        //             icon: <Map className="size-4" />,
        //         },
        //         {
        //             title: "Rectangle Category",
        //             url: "/dashboard/rectangle/categories",
        //             icon: <ListPlus className="size-4" />,
        //         },
        //         {
        //             title: "Add Rectangle",
        //             url: "/dashboard/rectangle/add",
        //             icon: <PlusCircle className="size-4" />,
        //         },
        //         // {
        //         //     title: "Edit & Delete Rectangle",
        //         //     url: "/dashboard/rectangle/edit-delete",
        //         //     icon: <Pencil className="size-4" />,
        //         // },
        //     ],
        // },
        {
            title: "Polygon",
            url: "/dashboard/polygon",
            items: [
                {
                    title: "Polygon Overview",
                    url: "/dashboard/polygon",
                    icon: <Map className="size-4" />,
                },
                {
                    title: "Polygon Category",
                    url: "/dashboard/polygon/categories",
                    icon: <ListPlus className="size-4" />,
                },
                {
                    title: "Add Polygon",
                    url: "/dashboard/polygon/add",
                    icon: <PlusCircle className="size-4" />,
                },
                // {
                //     title: "Edit & Delete Polygon",
                //     url: "/dashboard/polygon/edit-delete",
                //     icon: <Pencil className="size-4" />,
                // },
            ],
        },
        {
            title: "Circle",
            url: "/dashboard/circle",
            items: [
                {
                    title: "Circle Overview",
                    url: "/dashboard/circle",
                    icon: <Map className="size-4" />,
                },
                {
                    title: "Circle Category",
                    url: "/dashboard/circle/categories",
                    icon: <ListPlus className="size-4" />,
                },
                {
                    title: "Add Circle",
                    url: "/dashboard/circle/add",
                    icon: <PlusCircle className="size-4" />,
                },
                // {
                //     title: "Edit & Delete Circle",
                //     url: "/dashboard/circle/edit-delete",
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
