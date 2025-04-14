import { Skeleton } from "./ui/skeleton";

interface FormSkeletonProps {
    count: number;
    className?: string;
}

export default function FormSkeleton({ count, className }: FormSkeletonProps) {
    return (
        <div className={`${className} w-full space-y-6`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="space-y-2">
                    <Skeleton className="w-1/2 h-4" />
                    <Skeleton className="w-full h-10" />
                </div>
            ))}
            <Skeleton className="mt-4 w-full h-12" />
        </div>
    );
}
