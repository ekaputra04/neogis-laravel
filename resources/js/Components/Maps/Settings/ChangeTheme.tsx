import { ModeToggle } from "@/Components/ui/mode-toggle";

export default function ChangeThemeComponent() {
    return (
        <>
            <div className="space-y-6">
                <header>
                    <h2 className="font-medium text-gray-900 dark:text-white text-lg">
                        Change Theme
                    </h2>

                    <p className="mt-1 text-gray-600 dark:text-gray-200 text-sm">
                        Change the theme of website.
                    </p>
                </header>

                <ModeToggle />
            </div>
        </>
    );
}
