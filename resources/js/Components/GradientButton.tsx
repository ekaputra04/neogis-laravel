import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { AnimatedGradientText } from "./magicui/animated-gradient-text";

export function GradientButton({ text }: { text: string }) {
    return (
        <div className="group relative flex justify-center items-center shadow-[inset_0_-8px_10px_#8fdfff1f] hover:shadow-[inset_0_-5px_10px_#8fdfff3f] mx-auto px-4 py-1.5 rounded-full transition-shadow duration-500 ease-out">
            <span
                className={cn(
                    "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                )}
                style={{
                    WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "destination-out",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "subtract",
                    WebkitClipPath: "padding-box",
                }}
            />
            🎉 <hr className="bg-neutral-500 mx-2 w-px h-4 shrink-0" />
            <AnimatedGradientText className="font-medium text-sm">
                {text}
            </AnimatedGradientText>
            <ChevronRight className="stroke-neutral-500 ml-1 size-4 transition-transform group-hover:translate-x-0.5 duration-300 ease-in-out" />
        </div>
    );
}
