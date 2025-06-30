import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profile')({
    component: Profile,
})

function Profile() {
    const { isPending, error, data } = useQuery(userQueryOptions);

    if (isPending) return <div className="p-2 my-4 text-center">Loading...</div>
    if (error) return <div className="p-2 my-4 text-center">Not logged in</div>

    return (
        <div className="mx-auto flex flex-col items-center mt-4 max-w-md">
            <h1 className="text-2xl font-bold mb-6">Welcome, {data.user.given_name}!</h1>

            <div className="flex items-center gap-4 mb-6">
                <Avatar>
                    {data.user.picture ? (
                        <AvatarImage src={data.user.picture} alt={data.user.given_name} />
                    ) : (
                        <AvatarFallback>{data.user.given_name[0]}</AvatarFallback>
                    )}
                </Avatar>

                <div className="flex flex-col">
                    <p className="font-semibold">{data.user.given_name} {data.user.family_name}</p>
                    <p className="text-sm text-muted-foreground">{data.user.email}</p>
                </div>
            </div>

            <a href="/api/logout" className="underline hover:opacity-70">
                Logout
            </a>
        </div>
    )
}