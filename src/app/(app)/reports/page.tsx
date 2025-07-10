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
                <h1 className="text-3xl font-bold">Attendance Reports</h1>
                <p className="text-muted-foreground">Generate and export detailed attendance reports.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Report Generator</CardTitle>
                    <CardDescription>Select filters to generate a report.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="grid gap-2 w-full md:w-auto">
                        <Label>Report Type</Label>
                        <Select defaultValue="daily">
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily Summary</SelectItem>
                                <SelectItem value="weekly">Weekly Report</SelectItem>
                                <SelectItem value="monthly">Monthly Report</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid gap-2 w-full md:w-auto">
                        <Label>Date range</Label>
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
                                <CalendarIcon className="mr-2 h-4 w-4" />
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
                                <span>Pick a date</span>
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
                    <div className="flex gap-2 w-full md:w-auto md:ml-auto pt-5">
                        <Button className="w-full md:w-auto">Generate Report</Button>
                        <Button variant="outline" className="w-full md:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Generated Report</CardTitle>
                    <CardDescription>Showing results for the selected period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Clock In</TableHead>
                            <TableHead>Clock Out</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {attendanceRecords.slice(0, 5).map((record) => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium">{record.employeeName}</TableCell>
                                <TableCell>{format(new Date(), "LLL dd, y")}</TableCell>
                                <TableCell>{record.status.includes("In") ? record.timestamp : "---"}</TableCell>
                                <TableCell>{record.status.includes("Out") ? record.timestamp : "---"}</TableCell>
                                <TableCell>
                                    <Badge variant={record.status.includes("Late") || record.status.includes("Early") ? "destructive" : "secondary"}>
                                        {record.status}
                                    </Badge>
                                </TableCell>
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
