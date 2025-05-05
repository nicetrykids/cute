import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
    return (
        <div className="container p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="rounded-lg border bg-card text-card-foreground shadow">
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-8 w-5/6" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="rounded-lg border bg-card text-card-foreground shadow">
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-8 w-5/6" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="rounded-lg border bg-card text-card-foreground shadow">
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-8 w-5/6" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="col-span-1 md:col-span-2 rounded-lg border bg-card text-card-foreground shadow">
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-8 w-2/3" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                </div>

                {/* Card 5 */}
                <div className="rounded-lg border bg-card text-card-foreground shadow">
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-8 w-3/4" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
