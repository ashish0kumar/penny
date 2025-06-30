// import { userQueryOptions } from "@/lib/api"
import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router"

const Login = () => {
    return (
        <div className="flex flex-col items-center mt-6">
            <h1 className="text-xl font-bold mb-4">Please log in or register to continue</h1>
            <div className="flex gap-5">
                <a href="/api/login" className="underline hover:opacity-70">Login</a>
                <a href="/api/register" className="underline hover:opacity-70">Register</a>
            </div>
        </div>
    )
}

const Component = () => {
    const { user } = Route.useRouteContext();
    if (!user) {
        return <Login />;
    }

    return <Outlet />;
}

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ context }) => {
        const queryClient = context.queryClient;

        try {
            const data = await queryClient.fetchQuery(userQueryOptions);
            return data;
        } catch (e) {
            return { user: null };
        }
    },
    component: Component,
});