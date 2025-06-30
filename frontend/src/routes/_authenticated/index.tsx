import { createFileRoute } from '@tanstack/react-router'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'

export const Route = createFileRoute('/_authenticated/')({
    component: Index,
})

async function getTotalSpent() {
    const res = await api.expenses["total-spent"].$get()
    if (!res.ok) {
        throw new Error("server error")
    }
    const data = await res.json()
    return data
}

function Index() {
    const { isPending, error, data } = useQuery({
        queryKey: ['get-total-spent'],
        queryFn: getTotalSpent,
    })

    if (error) return "An error has occurred: " + error.message

    return (
        <div className='mt-4'>
            <Card className='w-[350px] mx-auto'>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold mb-2">Total Spent</CardTitle>
                    <CardDescription>The total amount you've spent</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>₹{isPending ? "..." : data.total}</p>
                </CardContent>
            </Card>
        </div>
    )
}