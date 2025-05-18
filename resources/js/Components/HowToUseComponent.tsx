import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { FileQuestion } from "lucide-react";
import { tutorialProps } from "@/types/types";

interface HowToUseProps {
    tutorials: tutorialProps[];
}

export default function HowToUseComponent({ tutorials }: HowToUseProps) {
    return (
        <Dialog>
            <DialogTrigger className="inline-flex justify-center items-center gap-2 bg-background hover:bg-accent disabled:opacity-50 shadow-sm mb-4 px-3 py-1 border border-input rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full [&_svg]:size-4 font-medium dark:text-white text-sm whitespace-nowrap transition-colors hover:text-accent-foreground [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0">
                <FileQuestion />
                <p>How to Use</p>
            </DialogTrigger>
            <DialogContent className="max-h-96 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="mb-4">
                        Petunjuk Penggunaan
                    </DialogTitle>
                    <DialogDescription className=""></DialogDescription>
                </DialogHeader>
                {tutorials.map((tutorial, index) => (
                    <div key={index} className="space-y-2">
                        <h1>{tutorial.description}</h1>
                        <img
                            src={tutorial.image}
                            alt={`Tutorial ${index + 1}`}
                        />
                    </div>
                ))}
            </DialogContent>
        </Dialog>
    );
}
