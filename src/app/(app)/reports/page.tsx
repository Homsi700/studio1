
"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { arSA } from "date-fns/locale"
import { Calendar as CalendarIcon, Download } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { getAttendanceRecords } from "@/actions/attendance-actions"
import type { AttendanceRecord } from "@/lib/data"
import { Label } from "@/components/ui/label"


export default function ReportsPage() {
    const [reportType, setReportType] = React.useState("attendance");
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    })
    const [records, setRecords] = React.useState<AttendanceRecord[]>([]);

    React.useEffect(() => {
        async function loadData() {
            const initialRecords = await getAttendanceRecords();
            setRecords(initialRecords);
        }
        loadData();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "حضور":
                return <Badge variant="secondary" className="bg-green-100 text-green-800">حضور</Badge>;
            case "تأخر":
                return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 border-yellow-200">تأخر</Badge>;
            case "انصراف":
                return <Badge variant="outline">انصراف</Badge>;
            case "انصراف مبكر":
                return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">انصراف مبكر</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">التقارير</h1>
                <p className="text-muted-foreground">إنشاء وتصدير تقارير الحضور المفصلة.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>فلاتر التقرير</CardTitle>
                    <CardDescription>اختر الفلاتر أدناه لتخصيص التقرير.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="grid gap-2 flex-1">
                            <Label htmlFor="report-type-select">نوع التقرير</Label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger id="report-type-select" className="w-full">
                                    <SelectValue placeholder="اختر النوع" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="attendance">الحضور</SelectItem>
                                    <SelectItem value="absence">الغياب</SelectItem>
                                    <SelectItem value="salaries">الرواتب</SelectItem>
                                    <SelectItem value="employees">الموظفين</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2 flex-1">
                            <Label htmlFor="date-range">النطاق الزمني</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    id="date-range"
                                    variant={"outline"}
                                    className={cn(
                                    "w-full justify-start text-right font-normal",
                                    !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="ml-2 h-4 w-4" />
                                    {date?.from ? (
                                    date.to ? (
                                        <>
                                        {format(date.from, "dd/MM/yyyy")} -{" "}
                                        {format(date.to, "dd/MM/yyyy")}
                                        </>
                                    ) : (
                                        format(date.from, "dd/MM/yyyy")
                                    )
                                    ) : (
                                    <span>اختر تاريخ</span>
                                    )}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                    locale={arSA}
                                />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                     <div className="flex justify-end gap-2 pt-4">
                        <Button>إنشاء تقرير</Button>
                        <Button variant="outline">
                            <Download className="ml-2 h-4 w-4" />
                            تصدير
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>عرض التقرير</CardTitle>
                    <CardDescription>عرض النتائج للفترة المحددة.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>الموظف</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead>وقت الحضور</TableHead>
                            <TableHead>وقت الانصراف</TableHead>
                            <TableHead>الحالة</TableHead>
                            <TableHead>التكلفة (ل.س)</TableHead>
                            <TableHead>التكلفة (USD)</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {records.slice(0, 5).map((record) => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium">{record.employeeName}</TableCell>
                                <TableCell>{format(new Date(), "dd/MM/yyyy")}</TableCell>
                                <TableCell>{record.status.includes("حضور") || record.status.includes("تأخر") ? record.timestamp : "---"}</TableCell>
                                <TableCell>{record.status.includes("انصراف") ? record.timestamp : "---"}</TableCell>
                                <TableCell>
                                    {getStatusBadge(record.status)}
                                </TableCell>
                                <TableCell>50,000</TableCell>
                                <TableCell>$3.50</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
