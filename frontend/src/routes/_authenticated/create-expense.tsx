import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { api, getAllExpensesQueryOptions } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

import { createExpenseSchema } from '@server/sharedTypes'

export const Route = createFileRoute('/_authenticated/create-expense')({
    component: CreateExpense,
})

function CreateExpense() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const form = useForm({
        validators: {
            onChange: createExpenseSchema,
        },
        defaultValues: {
            title: "",
            amount: "0",
            date: new Date().toISOString()
        },
        onSubmit: async ({ value }) => {

            const existingExpenses = await queryClient.ensureQueryData(getAllExpensesQueryOptions)

            const res = await api.expenses.$post({ json: value })
            if (!res.ok) {
                throw new Error('server error')
            }

            const newExpense = await res.json()
            queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, {
                ...existingExpenses,
                expenses: [newExpense, ...existingExpenses.expenses]
            })

            navigate({ to: '/expenses' })
        },
    })

    return (
        <div className='mt-4'>
            <h1 className="text-2xl font-bold mb-4 text-center">Create Expense</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className='max-w-sm m-auto flex flex-col'
            >
                <form.Field
                    name='title'
                    children={(field) => (
                        <div className='my-2'>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder='Title'
                            />
                            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                                <em className='text-sm text-destructive mt-2'>
                                    {field.state.meta.errors
                                        .map(err =>
                                            typeof err === 'string'
                                                ? err
                                                : err?.message || JSON.stringify(err)
                                        )
                                        .join(', ')
                                    }
                                </em>
                            ) : null}
                        </div>
                    )}
                />

                <form.Field
                    name='amount'
                    children={(field) => (
                        <div className='my-2'>
                            <div className='relative'>
                                <span className='absolute inset-y-0 left-0 flex items-center px-3 bg-primary'>
                                    ₹
                                </span>
                                <Input
                                    type='number'
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder='Amount'
                                    className='mb-1 pl-12'
                                />
                            </div>
                            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                                <em className='text-sm text-destructive mt-2'>
                                    {field.state.meta.errors
                                        .map(err =>
                                            typeof err === 'string'
                                                ? err
                                                : err?.message || JSON.stringify(err)
                                        )
                                        .join(', ')
                                    }
                                </em>
                            ) : null}
                        </div>
                    )}
                />

                <form.Field
                    name='date'
                    children={(field) => (
                        <div className='my-2 self-center'>
                            <Calendar
                                mode="single"
                                selected={new Date(field.state.value)}
                                onSelect={(date) =>
                                    field.handleChange((date ?? new Date()).toISOString())
                                }
                                className="rounded-md border shadow-sm"
                                captionLayout="dropdown"
                            />
                            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                                <em className='text-sm text-red-400 mt-2'>
                                    {field.state.meta.errors
                                        .map(err =>
                                            typeof err === 'string'
                                                ? err
                                                : err?.message || JSON.stringify(err)
                                        )
                                        .join(', ')
                                    }
                                </em>
                            ) : null}
                        </div>
                    )}
                />

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button className='mt-4 w-full' type='submit' disabled={!canSubmit}>
                            {isSubmitting ? '...' : 'Create Expense'}
                        </Button>
                    )}
                />
            </form>
        </div>
    )
}