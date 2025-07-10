
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
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { getEmployees } from "@/actions/employee-actions";
import type { Employee } from "@/lib/data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";


export default function SalariesPage() {
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const { toast } = useToast();

    const loadData = React.useCallback(async () => {
        const emps = await getEmployees();
        setEmployees(emps.filter(e => e.status === 'نشط'));
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const handleGeneratePayroll = () => {
        loadData();
        toast({
            title: "نجاح",
            description: "تم إنشاء كشف الرواتب بنجاح.",
            className: "bg-green-600 text-white border-green-600",
        });
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
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">إدارة الرواتب</h1>
                <p className="text-muted-foreground">حساب وتتبع رواتب الموظفين.</p>
            </div>
            
             <Card>
                <CardHeader>
                    <CardTitle>خيارات العرض</CardTitle>
                    <CardDescription>فلترة وتصدير كشوفات الرواتب.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="grid gap-2 w-full md:w-auto">
                        <Select defaultValue="monthly">
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="فترة الدفع" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">شهري</SelectItem>
                                <SelectItem value="weekly">أسبوعي</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto md:ml-auto">
                        <Button onClick={handleGeneratePayroll} className="w-full md:w-auto">إنشاء كشف رواتب</Button>
                        <Button variant="outline" className="w-full md:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            تصدير
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>كشف الرواتب</CardTitle>
                     <CardDescription>قائمة برواتب الموظفين النشطين للفترة الحالية.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>الموظف</TableHead>
                                <TableHead>المسمى الوظيفي</TableHead>
                                <TableHead>الراتب الأساسي</TableHead>
                                <TableHead>الخصومات</TableHead>
                                <TableHead>المكافآت</TableHead>
                                <TableHead>الراتب الصافي</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-medium">{employee.name}</TableCell>
                                    <TableCell>{employee.jobTitle}</TableCell>
                                    <TableCell>{formatCurrency(employee.salary, employee.currency)}</TableCell>
                                    <TableCell>{formatCurrency(0, employee.currency)}</TableCell>
                                    <TableCell>{formatCurrency(0, employee.currency)}</TableCell>
                                    <TableCell className="font-bold">{formatCurrency(employee.salary, employee.currency)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
