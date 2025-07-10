
"use client"

import { ReactNode, useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"

interface EmployeeDialogProps {
  children: ReactNode;
  employee?: Employee;
  onSave: (employee: Employee) => void;
}

export function EmployeeDialog({ children, employee, onSave }: EmployeeDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!employee;

  const [name, setName] = useState(employee?.name || "");
  const [employeeId, setEmployeeId] = useState(employee?.id || "");
  const [department, setDepartment] = useState(employee?.department || "");

  useEffect(() => {
    if (isOpen) {
      setName(employee?.name || "");
      setEmployeeId(employee?.id || "");
      setDepartment(employee?.department || "");
    }
  }, [isOpen, employee]);

  const handleSubmit = () => {
    if (!name || !employeeId || !department) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة.",
      });
      return;
    }
    onSave({
      id: employeeId,
      name,
      department,
      status: employee?.status || "نشط",
    });
    setIsOpen(false);
    toast({
        title: "نجاح",
        description: isEditMode ? "تم تحديث بيانات الموظف بنجاح." : "تم إضافة الموظف بنجاح.",
        className: "bg-green-600 text-white border-green-600"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employeeId" className="text-right">
              الرقم الوظيفي
            </Label>
            <Input id="employeeId" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="col-span-3" disabled={isEditMode} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              القسم
            </Label>
            <Select value={department} onValueChange={setDepartment}>
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
            <Button onClick={handleSubmit}>حفظ التغييرات</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
