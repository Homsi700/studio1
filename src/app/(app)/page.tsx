
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2 } from "lucide-react"
import { getAttendanceRecords, getAttendanceStats, getEmployeesByStatus } from "@/actions/attendance-actions"
import { DashboardDetailCard } from "@/components/dashboard-detail-card"

export default async function Dashboard() {
  const stats = await getAttendanceStats();
  const presentEmployees = await getEmployeesByStatus("present");
  const lateEmployees = await getEmployeesByStatus("late");
  const absentEmployees = await getEmployeesByStatus("absent");
  const attendanceRecords = await getAttendanceRecords();


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
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة عامة على الحضور في الوقت الفعلي</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardDetailCard
          title="الموظفون الحاضرون"
          value={stats.present}
          description="المتواجدون حالياً"
          icon="users"
          employees={presentEmployees}
          status="present"
        />
        <DashboardDetailCard
          title="الوصول المتأخر"
          value={stats.late}
          description="حالات التأخر اليوم"
          icon="clock"
          employees={lateEmployees}
          status="late"
          valueClassName="text-yellow-600"
        />
        <DashboardDetailCard
          title="الغائبون اليوم"
          value={stats.absent}
          description="الموظفون غير المتواجدين"
          icon="userx"
          employees={absentEmployees}
          status="absent"
          valueClassName="text-destructive"
        />
         <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              جهاز البصمة
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">متصل</div>
            <p className="text-xs text-primary-foreground/80">
              المزامنة الفورية مفعلة
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>آخر الحركات</CardTitle>
          <CardDescription>
            أحدث عمليات تسجيل الحضور والانصراف في النظام.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الموظف</TableHead>
                <TableHead>الوقت</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                       <Avatar className="h-9 w-9">
                        <AvatarImage src={record.avatar} alt={record.employeeName} data-ai-hint="person portrait" />
                        <AvatarFallback>{record.employeeName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{record.employeeName}</div>
                        <div className="text-sm text-muted-foreground">{record.employeeId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{record.timestamp}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
