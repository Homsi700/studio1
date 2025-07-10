"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
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
import { attendanceRecords } from "@/lib/data"


export default function ReportsPage() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    })

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">تقارير الحضور</h1>
                <p className="text-muted-foreground">إنشاء وتصدير تقارير الحضور المفصلة.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>مولد التقارير</CardTitle>
                    <CardDescription>اختر الفلاتر لإنشاء تقرير.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="grid gap-2 w-full md:w-auto">
                        <Label>نوع التقرير</Label>
                        <Select defaultValue="daily">
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="اختر النوع" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">ملخص يومي</SelectItem>
                                <SelectItem value="weekly">تقرير أسبوعي</SelectItem>
                                <SelectItem value="monthly">تقرير شهري</SelectItem>
                                <SelectItem value="custom">نطاق مخصص</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid gap-2 w-full md:w-auto">
                        <Label>النطاق الزمني</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-full md:w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="ml-2 h-4 w-4" />
                                {date?.from ? (
                                date.to ? (
                                    <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
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
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto md:mr-auto pt-5">
                        <Button className="w-full md:w-auto">إنشاء تقرير</Button>
                        <Button variant="outline" className="w-full md:w-auto">
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
                        {attendanceRecords.slice(0, 5).map((record) => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium">{record.employeeName}</TableCell>
                                <TableCell>{format(new Date(), "LLL dd, y")}</TableCell>
                                <TableCell>{record.status.includes("حضور") || record.status.includes("تأخر") ? record.timestamp : "---"}</TableCell>
                                <TableCell>{record.status.includes("انصراف") ? record.timestamp : "---"}</TableCell>
                                <TableCell>
                                    <Badge variant={record.status.includes("تأخر") || record.status.includes("مبكر") ? "destructive" : "secondary"}>
                                        {record.status}
                                    </Badge>
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

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-muted-foreground">{children}</label>;
}
