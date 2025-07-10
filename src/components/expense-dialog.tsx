
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
import { type Expense } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

interface ExpenseDialogProps {
  children: ReactNode;
  expense?: Expense;
  onSave: (expense: Expense) => void;
}

export function ExpenseDialog({ children, expense, onSave }: ExpenseDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!expense;

  const [item, setItem] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [currency, setCurrency] = useState<'USD' | 'SYP'>('USD');
  
  const resetForm = () => {
    setItem(expense?.item || "");
    setCategory(expense?.category || "");
    setAmount(expense?.amount || "");
    setCurrency(expense?.currency || 'USD');
  }

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, expense]);

  const handleSubmit = () => {
    if (!item || !category || amount === "") {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة.",
      });
      return;
    }

    onSave({
      id: expense?.id || '', // id will be generated on server for new items
      date: expense?.date || '', // date will be generated on server for new items
      item,
      category,
      amount: Number(amount),
      currency,
    });

    setIsOpen(false);
    toast({
        title: "نجاح",
        description: isEditMode ? "تم تحديث المصروف بنجاح." : "تم إضافة المصروف بنجاح.",
        className: "bg-green-600 text-white border-green-600"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "تعديل مصروف" : "إضافة مصروف جديد"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "تحديث تفاصيل المصروف." : "أدخل تفاصيل المصروف الجديد."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item" className="text-right">
              البند
            </Label>
            <Input id="item" value={item} onChange={(e) => setItem(e.target.value)} className="col-span-3" placeholder="مثال: فاتورة كهرباء" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              الفئة
            </Label>
            <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر فئة" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="فواتير">فواتير</SelectItem>
                    <SelectItem value="صيانة">صيانة</SelectItem>
                    <SelectItem value="مستلزمات مكتبية">مستلزمات مكتبية</SelectItem>
                    <SelectItem value="نقل">نقل</SelectItem>
                    <SelectItem value="أخرى">أخرى</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              المبلغ
            </Label>
            <div className="col-span-3 flex gap-2">
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} placeholder="أدخل المبلغ" />
                <Select value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'SYP')}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">$ USD</SelectItem>
                        <SelectItem value="SYP">ل.س</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
            <Button onClick={handleSubmit}>حفظ</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
