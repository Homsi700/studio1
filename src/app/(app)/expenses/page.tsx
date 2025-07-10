
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "@/actions/employee-actions";
import type { Expense } from "@/lib/data";
import { ExpenseDialog } from "@/components/expense-dialog";

export default function ExpensesPage() {
    const [expenses, setExpenses] = React.useState<Expense[]>([]);
    const [deleteTarget, setDeleteTarget] = React.useState<Expense | null>(null);

    const loadData = React.useCallback(async () => {
        const expenseData = await getExpenses();
        setExpenses(expenseData);
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSaveExpense = async (expenseData: Expense) => {
        const isEditing = expenses.some(e => e.id === expenseData.id);
        if (isEditing) {
            await updateExpense(expenseData);
        } else {
            const newExpenseData = expenseData as Omit<Expense, 'id' | 'date'>;
            await addExpense(newExpenseData);
        }
        await loadData();
    };

    const handleDeleteExpense = async (expenseId: string) => {
        if (!deleteTarget) return;
        await deleteExpense(expenseId);
        setExpenses(expenses.filter(e => e.id !== expenseId));
        setDeleteTarget(null);
    };

    const formatCurrency = (amount: number, currency: 'USD' | 'SYP') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(amount);
    }
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-SY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <AlertDialog>
            <div className="flex flex-col gap-6">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">إدارة المصاريف</h1>
                        <p className="text-muted-foreground">تسجيل وتتبع مصاريف المنشأة.</p>
                    </div>
                    <ExpenseDialog onSave={handleSaveExpense}>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            إضافة مصروف
                        </Button>
                    </ExpenseDialog>
                </header>

                <main>
                    <Card>
                        <CardHeader>
                            <CardTitle>سجل المصاريف</CardTitle>
                            <CardDescription>قائمة بجميع المصاريف المسجلة.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>التاريخ</TableHead>
                                        <TableHead>البند</TableHead>
                                        <TableHead>الفئة</TableHead>
                                        <TableHead>المبلغ</TableHead>
                                        <TableHead><span className="sr-only">إجراءات</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {expenses.map((expense) => (
                                        <TableRow key={expense.id}>
                                            <TableCell>{formatDate(expense.date)}</TableCell>
                                            <TableCell className="font-medium">{expense.item}</TableCell>
                                            <TableCell>{expense.category}</TableCell>
                                            <TableCell>{formatCurrency(expense.amount, expense.currency)}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">فتح القائمة</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <ExpenseDialog expense={expense} onSave={handleSaveExpense}>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                <Edit className="mr-2 h-4 w-4"/> تعديل
                                                            </DropdownMenuItem>
                                                        </ExpenseDialog>
                                                         <DropdownMenuItem className="text-destructive" onSelect={(e) => { e.preventDefault(); setDeleteTarget(expense); }}>
                                                            <Trash2 className="mr-2 h-4 w-4"/> حذف
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </main>
            </div>
             {deleteTarget && (
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription>
                          سيؤدي هذا الإجراء إلى حذف المصروف "{deleteTarget.item}" بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteTarget(null)}>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteExpense(deleteTarget.id)} className="bg-destructive hover:bg-destructive/90">
                            حذف
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            )}
        </AlertDialog>
    );
}
