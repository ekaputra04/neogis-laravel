import { Laptop, Moon, Sun } from "lucide-react";

import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useThemeStore } from "@/Store/themeStore";

export function ModeToggle() {
    const { setTheme } = useThemeStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="p-4">
                    <Sun className="w-[1.2rem] h-[1.2rem] rotate-0 dark:-rotate-90 scale-100 dark:scale-0 transition-all" />
                    <Moon className="absolute w-[1.2rem] h-[1.2rem] rotate-90 dark:rotate-0 scale-0 dark:scale-100 transition-all" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4" />
                        System
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
