

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Edit, Save } from "lucide-react";
import {
    getShifts,
    addShift,
    updateShift,
    deleteShift,
} from "@/actions/settings-actions";
import type { Shift } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function ShiftsPage() {
  const { toast } = useToast();
  const [shifts, setShifts] = React.useState<Shift[]>([]);
  const [newShiftName, setNewShiftName] = React.useState("");
  const [newShiftTime, setNewShiftTime] = React.useState("");
  const [editingShiftId, setEditingShiftId] = React.useState<string | null>(null);
  const [editingShiftName, setEditingShiftName] = React.useState("");
  const [editingShiftTime, setEditingShiftTime] = React.useState("");

  const refreshData = React.useCallback(async () => {
      const shs = await getShifts();
      setShifts(shs);
  }, []);

  React.useEffect(() => {
      refreshData();
  }, [refreshData]);

  const handleAddShift = async () => {
    if (newShiftName.trim() && newShiftTime.trim()) {
      await addShift(newShiftName.trim(), newShiftTime.trim());
      setNewShiftName("");
      setNewShiftTime("");
      await refreshData();
       toast({ title: "نجاح", description: "تمت إضافة الوردية بنجاح." });
    }
  };

  const handleDeleteShift = async (id: string) => {
    await deleteShift(id);
    await refreshData();
    toast({ title: "نجاح", description: "تم حذف الوردية." });
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShiftId(shift.id);
    setEditingShiftName(shift.name);
    setEditingShiftTime(shift.time);
  };

  const handleSaveShift = async (id: string) => {
      await updateShift(id, editingShiftName, editingShiftTime);
      setEditingShiftId(null);
      await refreshData();
      toast({ title: "نجاح", description: "تم تحديث الوردية." });
  };


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">إدارة الورديات</h1>
        <p className="text-muted-foreground">
          إضافة وتعديل وحذف ورديات العمل.
        </p>
      </div>
        <Card>
          <CardHeader>
            <CardTitle>الورديات</CardTitle>
            <CardDescription>إضافة أو تعديل أو حذف ورديات العمل.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="اسم الوردية"
                value={newShiftName}
                onChange={(e) => setNewShiftName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddShift()}
              />
              <Input
                placeholder="التوقيت (مثال: 9ص - 5م)"
                value={newShiftTime}
                onChange={(e) => setNewShiftTime(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddShift()}
              />
              <Button onClick={handleAddShift} size="icon">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
             <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {shifts.map((sh) => (
                <div key={sh.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    {editingShiftId === sh.id ? (
                        <>
                            <Input value={editingShiftName} onChange={(e) => setEditingShiftName(e.target.value)} className="h-8"/>
                            <Input value={editingShiftTime} onChange={(e) => setEditingShiftTime(e.target.value)} className="h-8 mx-2"/>
                        </>
                    ) : (
                        <div>
                            <span>{sh.name}</span>
                            <span className="text-xs text-muted-foreground mr-2">({sh.time})</span>
                        </div>
                    )}
                  <div className="flex gap-2">
                    {editingShiftId === sh.id ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={() => handleSaveShift(sh.id)}>
                            <Save className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditShift(sh)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90" onClick={() => handleDeleteShift(sh.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
