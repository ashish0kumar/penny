import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteExpense, getAllExpensesQueryOptions, loadingCreateExpenseQueryOptions } from '@/lib/api'
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
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/expenses')({
    component: Expenses,
})

function Expenses() {
    const { isPending, error, data } = useQuery(getAllExpensesQueryOptions)
    const { data: loadingCreateExpense } = useQuery(loadingCreateExpenseQueryOptions)

    if (error) return "An error has occurred: " + error.message

    return (
        <div className="mt-4 max-w-xl m-auto">
            <h1 className="text-2xl font-bold mb-2 text-center">Expenses</h1>
            <Table className='mt-2'>
                <TableCaption className='mb-10'>List of all your expenses</TableCaption>
                <TableHeader>
                    <TableRow className='bg-card'>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loadingCreateExpense?.expense && (
                        <TableRow>
                            <TableCell className="font-medium"><Skeleton className="h-4 w-5" /></TableCell>
                            <TableCell>{loadingCreateExpense?.expense.title}</TableCell>
                            <TableCell>{loadingCreateExpense?.expense.date.split("T")[0]}</TableCell>
                            <TableCell className="text-right">₹{loadingCreateExpense.expense.amount}</TableCell>
                            <TableCell className="text-right"><Skeleton className="h-7 w-8 ml-4" /></TableCell>
                        </TableRow>
                    )}
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
                                    <TableCell className='text-right'>
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
                                <TableCell className="text-right">
                                    <ExpenseDeleteButton id={expense.id} />
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

function ExpenseDeleteButton({ id }: { id: number }) {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: deleteExpense,
        onError: () => {
            toast("Failed to delete expense", {
                description: "Something went wrong. Please check your connection or try again.",
            })
        },
        onSuccess: () => {
            toast("Expense deleted", {
                description: `Expense #${id} has been removed.`,
            })

            queryClient.setQueryData(getAllExpensesQueryOptions.queryKey,
                (existingExpenses) => ({
                    ...existingExpenses,
                    expenses: existingExpenses!.expenses.filter((e) => e.id !== id)
                })
            )
        },
    })

    return (
        <Button
            disabled={mutation.isPending}
            onClick={() => mutation.mutate({ id })}
            size="sm"
            className='h-7 w-8 bg-muted'
        >
            {mutation.isPending ? "..." : <Trash className="h-4 w-4" />}
        </Button>
    )
}