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
import { Users, Clock, UserX, CheckCircle2, XCircle } from "lucide-react"
import { attendanceRecords, getAttendanceStats } from "@/lib/data"

export default function Dashboard() {
  const stats = getAttendanceStats();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Clocked In":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Clocked In</Badge>;
      case "Late In":
        return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 border-yellow-200">Late In</Badge>;
      case "Clocked Out":
        return <Badge variant="outline">Clocked Out</Badge>;
      case "Early Out":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Early Out</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Real-time attendance overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Present Employees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.present}</div>
            <p className="text-xs text-muted-foreground">
              Currently in office
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
            <p className="text-xs text-muted-foreground">Today's late entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">
              Employees not present
            </p>
          </CardContent>
        </Card>
         <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Biometric Device
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Connected</div>
            <p className="text-xs text-primary-foreground/80">
              Real-time sync enabled
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest clock-ins and clock-outs from the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
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
