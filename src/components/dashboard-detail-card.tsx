
"use client"

import type { LucideIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Employee } from "@/lib/data"
import { cn } from "@/lib/utils"

interface DashboardDetailCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  employees: Employee[];
  status: 'present' | 'late' | 'absent';
  valueClassName?: string;
}

const statusTitles = {
    present: "قائمة الموظفين الحاضرين",
    late: "قائمة الموظفين المتأخرين",
    absent: "قائمة الموظفين الغائبين"
}

export function DashboardDetailCard({ title, value, description, icon: Icon, employees, status, valueClassName }: DashboardDetailCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {title}
            </CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{statusTitles[status]}</DialogTitle>
          <DialogDescription>
            {employees.length > 0 ? `إجمالي عدد الموظفين: ${employees.length}` : "لا يوجد موظفين لعرضهم حالياً."}
          </DialogDescription>
        </DialogHeader>
        {employees.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>الموظف</TableHead>
                        <TableHead>الرقم الوظيفي</TableHead>
                        <TableHead>القسم</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {employees.map((employee) => (
                        <TableRow key={employee.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={`https://placehold.co/40x40.png?text=${employee.name.charAt(0)}`} alt={employee.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{employee.name}</div>
                            </div>
                        </TableCell>
                        <TableCell className="font-mono text-left">{employee.id}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
