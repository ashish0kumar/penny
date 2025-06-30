import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Skeleton } from "@/components/ui/skeleton"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export const Route = createFileRoute('/_authenticated/expenses')({
    component: Expenses,
})
async function getAllExpenses() {
    const res = await api.expenses.$get()
    if (!res.ok) {
        throw new Error("server error")
    }
    const data = await res.json()
    return data
}

function Expenses() {
    const { isPending, error, data } = useQuery({
        queryKey: ['get-all-expenses'],
        queryFn: getAllExpenses,
    })

    if (error) return "An error has occurred: " + error.message

    return (
        <div className="mt-4 max-w-lg m-auto">
            <h1 className="text-2xl font-bold mb-2 text-center">Expenses</h1>
            <Table className='mt-2'>
                <TableCaption>List of all your expenses</TableCaption>
                <TableHeader>
                    <TableRow className='bg-card'>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isPending
                        ? Array(5)
                            .fill(0)
                            .map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">
                                        <Skeleton className="h-4" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4" />
                                    </TableCell>
                                    <TableCell className='h-4'>
                                        <Skeleton className="h-4" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-4" />
                                    </TableCell>
                                </TableRow>
                            ))
                        :
                        data?.expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="font-medium">{expense.id}</TableCell>
                                <TableCell>{expense.title}</TableCell>
                                <TableCell>{expense.date.split("T")[0]}</TableCell>
                                <TableCell className="text-right">₹{expense.amount}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}