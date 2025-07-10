"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Employee } from "@/lib/data"

interface EmployeeDialogProps {
  children: ReactNode;
  employee?: Employee;
}

export function EmployeeDialog({ children, employee }: EmployeeDialogProps) {
  const isEditMode = !!employee;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "تعديل موظف" : "إضافة موظف جديد"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "تحديث تفاصيل الموظف." : "أدخل تفاصيل الموظف الجديد."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input id="name" defaultValue={employee?.name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employeeId" className="text-right">
              الرقم الوظيفي
            </Label>
            <Input id="employeeId" defaultValue={employee?.id} className="col-span-3" disabled={isEditMode} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              القسم
            </Label>
            <Select defaultValue={employee?.department}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر قسماً" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="الهندسة">الهندسة</SelectItem>
                    <SelectItem value="الموارد البشرية">الموارد البشرية</SelectItem>
                    <SelectItem value="التسويق">التسويق</SelectItem>
                    <SelectItem value="المالية">المالية</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fingerprint" className="text-right">
              البصمة
            </Label>
            <Button variant="outline" className="col-span-3">
              {isEditMode ? "إعادة مسح البصمة" : "مسح البصمة"}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">حفظ التغييرات</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
