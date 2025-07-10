

"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import {
    getEmployees,
    getJobTitles,
    getShifts,
    addEmployee,
    updateEmployee,
    deleteEmployee,
} from "@/actions/employee-actions";
import type { Employee, JobTitle, Shift } from "@/lib/data"
import { EmployeeDialog } from "@/components/employee-dialog"

export default function EmployeesPage() {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [jobTitles, setJobTitles] = React.useState<JobTitle[]>([]);
  const [shifts, setShifts] = React.useState<Shift[]>([]);
  const [deleteTarget, setDeleteTarget] = React.useState<Employee | null>(null);

  const loadData = React.useCallback(async () => {
    const [emps, jts, shs] = await Promise.all([
        getEmployees(),
        getJobTitles(),
        getShifts()
    ]);
    setEmployees(emps);
    setJobTitles(jts);
    setShifts(shs);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData])

  const handleSaveEmployee = async (employeeData: Employee) => {
    const isEditing = employees.some(e => e.id === employeeData.id);
    if (isEditing) {
      await updateEmployee(employeeData);
    } else {
      const newEmployeeData = { ...employeeData, status: "نشط" } as Omit<Employee, 'status'> & { status: "نشط" };
      await addEmployee(newEmployeeData);
    }
    await loadData();
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    await deleteEmployee(employeeId);
    setEmployees(employees.filter(e => e.id !== employeeId));
    setDeleteTarget(null);
  };
  
  const formatCurrency = (amount: number, currency: 'USD' | 'SYP') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <AlertDialog>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">إدارة الموظفين</h1>
            <p className="text-muted-foreground">إضافة وتعديل وإدارة بيانات الموظفين.</p>
          </div>
          <EmployeeDialog onSave={handleSaveEmployee} jobTitles={jobTitles} shifts={shifts}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              إضافة موظف
            </Button>
          </EmployeeDialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة الموظفين</CardTitle>
            <CardDescription>
              قائمة بجميع الموظفين في النظام.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرقم التعريفي</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>المسمى الوظيفي</TableHead>
                  <TableHead>الراتب</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>
                    <span className="sr-only">إجراءات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-mono text-left">{employee.id}</TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.jobTitle}</TableCell>
                    <TableCell>{formatCurrency(employee.salary, employee.currency)}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === "نشط" ? "default" : "secondary"}
                        className={employee.status === "نشط" ? "bg-green-600 text-white" : ""}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">فتح القائمة</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <EmployeeDialog employee={employee} onSave={handleSaveEmployee} jobTitles={jobTitles} shifts={shifts}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>تعديل</DropdownMenuItem>
                          </EmployeeDialog>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem className="text-destructive" onSelect={(e) => {e.preventDefault(); setDeleteTarget(employee);}}>حذف</DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {deleteTarget && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيؤدي هذا الإجراء إلى حذف الموظف "{deleteTarget.name}" بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteEmployee(deleteTarget.id)} className="bg-destructive hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  )
}
