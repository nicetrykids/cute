import * as React from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link, Outlet, useLocation } from "react-router"
import { AppSidebar } from "./side-bar/app-sidebar"
import { SearchButton } from "@/components/common/SearchButton"

export default function SideBarLayout() {
    const location = useLocation()

    // Process the current path for breadcrumb
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '')

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex sticky top-0 z-20 h-16 shrink-0 items-center gap-2 bg-background p-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 w-full justify-between">
                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link to="/">Home</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {pathSegments.map((segment, index) => {
                                        const path = `/${pathSegments.slice(0, index + 1).join('/')}`
                                        const isLast = index === pathSegments.length - 1

                                        return (
                                            <React.Fragment key={path}>
                                                <BreadcrumbSeparator />
                                                <BreadcrumbItem>
                                                    {isLast ? (
                                                        <BreadcrumbPage>
                                                            {segment.charAt(0).toUpperCase() + segment.slice(1)}
                                                        </BreadcrumbPage>
                                                    ) : (
                                                        <BreadcrumbLink asChild>
                                                            <Link to={path}>
                                                                {segment.charAt(0).toUpperCase() + segment.slice(1)}
                                                            </Link>
                                                        </BreadcrumbLink>
                                                    )}
                                                </BreadcrumbItem>
                                            </React.Fragment>
                                        )
                                    })}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="relative ml-auto">
                            <SearchButton />
                        </div>
                    </div>
                </header>
                <div className="relative no-scrollbar overflow-y-hidden">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
