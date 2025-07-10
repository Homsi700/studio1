
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
import { type Employee, type JobTitle, type Shift } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Fingerprint } from "lucide-react"

interface EmployeeDialogProps {
  children: ReactNode;
  employee?: Employee;
  onSave: (employee: Employee) => void;
  jobTitles: JobTitle[];
  shifts: Shift[];
}

export function EmployeeDialog({ children, employee, onSave, jobTitles, shifts }: EmployeeDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!employee;

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [shift, setShift] = useState("");
  const [fingerprintScanned, setFingerprintScanned] = useState(false);

  const resetForm = () => {
    setId(employee?.id || "");
    setName(employee?.name || "");
    setDepartment(employee?.department || "");
    setJobTitle(employee?.jobTitle || "");
    setShift(employee?.shift || "");
    setFingerprintScanned(isEditMode); // Assume fingerprint is already scanned in edit mode
  }

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, employee]);

  const handleScanFingerprint = () => {
    if (!id || id.length !== 4 || !/^\d{4}$/.test(id)) {
        toast({
            variant: "destructive",
            title: "خطأ",
            description: "يرجى إدخال رقم تعريفي فريد وصحيح مكون من 4 أرقام أولاً.",
        });
        return;
    }
    // Simulate fingerprint scanning
    setFingerprintScanned(true);
    toast({
        title: "نجاح",
        description: `تم ربط البصمة بالرقم التعريفي ${id}.`,
    });
  }

  const handleSubmit = () => {
    if (!id || !name || !department || !jobTitle || !shift) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة.",
      });
      return;
    }
    if (!fingerprintScanned) {
         toast({
            variant: "destructive",
            title: "خطأ",
            description: "يرجى مسح بصمة الموظف قبل الحفظ.",
        });
        return;
    }

    onSave({
      id,
      name,
      department,
      jobTitle,
      shift,
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
            <Label htmlFor="employeeId" className="text-right">
              الرقم التعريفي
            </Label>
            <Input 
              id="employeeId" 
              value={id} 
              onChange={(e) => setId(e.target.value)} 
              className="col-span-3 font-mono" 
              disabled={isEditMode}
              placeholder="4 أرقام فريدة"
              maxLength={4}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
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
            <Label htmlFor="jobTitle" className="text-right">
              المسمى الوظيفي
            </Label>
            <Select value={jobTitle} onValueChange={setJobTitle}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر المسمى" />
                </SelectTrigger>
                <SelectContent>
                    {jobTitles.map((jt) => (
                        <SelectItem key={jt.id} value={jt.name}>{jt.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shift" className="text-right">
              الوردية
            </Label>
            <Select value={shift} onValueChange={setShift}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر الوردية" />
                </SelectTrigger>
                <SelectContent>
                    {shifts.map((s) => (
                        <SelectItem key={s.id} value={s.name}>{s.name} ({s.time})</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fingerprint" className="text-right">
              البصمة
            </Label>
            <Button variant="outline" className="col-span-3" onClick={handleScanFingerprint}>
              <Fingerprint className="mr-2 h-4 w-4" />
              {fingerprintScanned ? "تم مسح البصمة" : "مسح البصمة"}
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
