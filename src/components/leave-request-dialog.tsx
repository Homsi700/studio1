
"use client"

import { ReactNode, useState } from "react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { type Employee, type Leave } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { addLeaveRequest } from "@/actions/leaves-actions"


interface LeaveRequestDialogProps {
  children: ReactNode;
  employees: Employee[];
}

export function LeaveRequestDialog({ children, employees }: LeaveRequestDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const [employeeId, setEmployeeId] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [reason, setReason] = useState("");

  const resetForm = () => {
    setEmployeeId("");
    setLeaveType("");
    setStartDate(undefined);
    setEndDate(undefined);
    setReason("");
  }

  const handleSubmit = async () => {
    if (!employeeId || !leaveType || !startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى ملء جميع الحقول الإلزامية.",
      });
      return;
    }

    const leaveData: Omit<Leave, 'id' | 'status'> = {
        employeeId,
        leaveType,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        reason
    };
    
    await addLeaveRequest(leaveData);

    setIsOpen(false);
    resetForm();
    toast({
        title: "نجاح",
        description: "تم إرسال طلب الإجازة بنجاح.",
        className: "bg-green-600 text-white border-green-600"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>تقديم طلب إجازة</DialogTitle>
          <DialogDescription>
            املأ النموذج أدناه لتقديم طلب إجازة جديد.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              الموظف
            </Label>
             <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر الموظف" />
                </SelectTrigger>
                <SelectContent>
                    {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="leaveType" className="text-right">
              نوع الإجازة
            </Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر نوع الإجازة" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="مرضية">إجازة مرضية</SelectItem>
                    <SelectItem value="سنوية">إجازة سنوية</SelectItem>
                    <SelectItem value="طارئة">إجازة طارئة</SelectItem>
                    <SelectItem value="بدون أجر">إجازة بدون أجر</SelectItem>
                </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              تاريخ البدء
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-right font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>اختر تاريخاً</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              تاريخ الانتهاء
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-right font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>اختر تاريخاً</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
           <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="reason" className="text-right pt-2">
              السبب (اختياري)
            </Label>
             <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="col-span-3" placeholder="أدخل سبب طلب الإجازة..."/>
          </div>
        </div>
        <DialogFooter>
            <Button onClick={handleSubmit}>إرسال الطلب</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
