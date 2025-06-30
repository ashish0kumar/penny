import { Toaster } from '@/components/ui/sonner'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'

interface MyRouterContext {
    queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: Root,
})

function NavBar() {
    return (
        <div className="px-8 py-4 flex justify-between items-baseline max-w-xl mx-auto">
            <Link to="/" className="text-2xl font-bold">
                ₹ Penny
            </Link>
            <div className="flex gap-6">
                <Link to="/expenses" className="[&.active]:font-bold">
                    Expenses
                </Link>
                <Link to="/create-expense" className="[&.active]:font-bold">
                    Create
                </Link>
                <Link to="/profile" className="[&.active]:font-bold">
                    Profile
                </Link>
            </div>
        </div>
    )
}

function Root() {
    return (
        <>
            <NavBar />
            <hr />
            <div className="px-8 py-4 gap-6 max-w-2xl m-auto">
                <Outlet />
            </div >
            <Toaster />
        </>
    )
}