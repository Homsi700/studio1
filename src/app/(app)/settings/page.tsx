
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
  jobTitles as initialJobTitles,
  shifts as initialShifts,
  type JobTitle,
  type Shift,
} from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [jobTitles, setJobTitles] = React.useState<JobTitle[]>(initialJobTitles);
  const [shifts, setShifts] = React.useState<Shift[]>(initialShifts);
  const [newJobTitle, setNewJobTitle] = React.useState("");
  const [newShiftName, setNewShiftName] = React.useState("");
  const [newShiftTime, setNewShiftTime] = React.useState("");
  const [editingJobTitleId, setEditingJobTitleId] = React.useState<string | null>(null);
  const [editingJobTitleValue, setEditingJobTitleValue] = React.useState("");
  const [editingShiftId, setEditingShiftId] = React.useState<string | null>(null);
  const [editingShiftName, setEditingShiftName] = React.useState("");
  const [editingShiftTime, setEditingShiftTime] = React.useState("");

  // Job Title Handlers
  const handleAddJobTitle = () => {
    if (newJobTitle.trim()) {
      setJobTitles([
        ...jobTitles,
        { id: `jt-${Date.now()}`, name: newJobTitle.trim() },
      ]);
      setNewJobTitle("");
      toast({ title: "نجاح", description: "تمت إضافة المسمى الوظيفي بنجاح." });
    }
  };

  const handleDeleteJobTitle = (id: string) => {
    setJobTitles(jobTitles.filter((jt) => jt.id !== id));
    toast({ title: "نجاح", description: "تم حذف المسمى الوظيفي." });
  };

  const handleEditJobTitle = (jobTitle: JobTitle) => {
    setEditingJobTitleId(jobTitle.id);
    setEditingJobTitleValue(jobTitle.name);
  };
  
  const handleSaveJobTitle = (id: string) => {
    setJobTitles(
      jobTitles.map((jt) =>
        jt.id === id ? { ...jt, name: editingJobTitleValue } : jt
      )
    );
    setEditingJobTitleId(null);
    toast({ title: "نجاح", description: "تم تحديث المسمى الوظيفي." });
  };


  // Shift Handlers
  const handleAddShift = () => {
    if (newShiftName.trim() && newShiftTime.trim()) {
      setShifts([
        ...shifts,
        {
          id: `sh-${Date.now()}`,
          name: newShiftName.trim(),
          time: newShiftTime.trim(),
        },
      ]);
      setNewShiftName("");
      setNewShiftTime("");
       toast({ title: "نجاح", description: "تمت إضافة الوردية بنجاح." });
    }
  };

  const handleDeleteShift = (id: string) => {
    setShifts(shifts.filter((sh) => sh.id !== id));
    toast({ title: "نجاح", description: "تم حذف الوردية." });
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShiftId(shift.id);
    setEditingShiftName(shift.name);
    setEditingShiftTime(shift.time);
  };

  const handleSaveShift = (id: string) => {
      setShifts(
          shifts.map((s) =>
              s.id === id ? { ...s, name: editingShiftName, time: editingShiftTime } : s
          )
      );
      setEditingShiftId(null);
      toast({ title: "نجاح", description: "تم تحديث الوردية." });
  };


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">
          إدارة المسميات الوظيفية والورديات لتسهيل إدارة الموظفين.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>المسميات الوظيفية</CardTitle>
            <CardDescription>إضافة أو تعديل أو حذف المسميات الوظيفية.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="إضافة مسمى وظيفي جديد"
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddJobTitle()}
              />
              <Button onClick={handleAddJobTitle} size="icon">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {jobTitles.map((jt) => (
                <div key={jt.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                  {editingJobTitleId === jt.id ? (
                      <Input value={editingJobTitleValue} onChange={(e) => setEditingJobTitleValue(e.target.value)} className="h-8"/>
                  ) : (
                    <span>{jt.name}</span>
                  )}
                  <div className="flex gap-2">
                    {editingJobTitleId === jt.id ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={() => handleSaveJobTitle(jt.id)}>
                            <Save className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditJobTitle(jt)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/90" onClick={() => handleDeleteJobTitle(jt.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
}
