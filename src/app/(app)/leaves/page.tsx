
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { getLeaveRequests, updateLeaveStatus, deleteLeaveRequest } from "@/actions/leaves-actions";
import type { Leave } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type LeaveRequestWithEmployee = Leave & { employeeName: string };

export default function LeavesPage() {
    const { toast } = useToast();
    const [leaveRequests, setLeaveRequests] = React.useState<LeaveRequestWithEmployee[]>([]);

    const loadData = React.useCallback(async () => {
        const data = await getLeaveRequests();
        setLeaveRequests(data);
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);
    
    const handleUpdateStatus = async (id: string, status: 'موافق عليه' | 'مرفوض') => {
        await updateLeaveStatus(id, status);
        toast({ title: "نجاح", description: `تم تحديث حالة الطلب إلى "${status}".`});
        loadData();
    };

    const handleDelete = async (id: string) => {
        await deleteLeaveRequest(id);
        toast({ title: "نجاح", description: "تم حذف طلب الإجازة."});
        loadData();
    }

    const getStatusBadge = (status: Leave['status']) => {
        switch (status) {
            case "قيد المراجعة":
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">قيد المراجعة</Badge>;
            case "موافق عليه":
                return <Badge variant="default" className="bg-green-600 text-white">موافق عليه</Badge>;
            case "مرفوض":
                return <Badge variant="destructive">مرفوض</Badge>;
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-SY', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold">إدارة الإجازات</h1>
                <p className="text-muted-foreground">مراجعة طلبات الإجازات والموافقة عليها أو رفضها.</p>
            </header>
            <main>
                <Card>
                    <CardHeader>
                        <CardTitle>طلبات الإجازات</CardTitle>
                        <CardDescription>جميع طلبات الإجازات المقدمة من الموظفين.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الموظف</TableHead>
                                    <TableHead>نوع الإجازة</TableHead>
                                    <TableHead>تاريخ البدء</TableHead>
                                    <TableHead>تاريخ الانتهاء</TableHead>
                                    <TableHead>الحالة</TableHead>
                                    <TableHead><span className="sr-only">إجراءات</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaveRequests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-medium">{request.employeeName}</TableCell>
                                        <TableCell>{request.leaveType}</TableCell>
                                        <TableCell>{formatDate(request.startDate)}</TableCell>
                                        <TableCell>{formatDate(request.endDate)}</TableCell>
                                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">فتح القائمة</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onSelect={() => handleUpdateStatus(request.id, 'موافق عليه')}>
                                                        <Check className="mr-2 h-4 w-4 text-green-600" /> موافقة
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleUpdateStatus(request.id, 'مرفوض')}>
                                                        <X className="mr-2 h-4 w-4 text-destructive" /> رفض
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onSelect={() => handleDelete(request.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4"/> حذف الطلب
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
