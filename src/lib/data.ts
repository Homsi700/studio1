export type Employee = {
  id: string;
  name: string;
  department: string;
  status: "نشط" | "في إجازة";
};

export type AttendanceRecord = {
  id: string;
  employeeName: string;
  employeeId: string;
  timestamp: string;
  status: "حضور" | "انصراف" | "تأخر" | "انصراف مبكر";
  avatar: string;
};

export const employees: Employee[] = [
  { id: "EMP001", name: "أحمد الفارسي", department: "الهندسة", status: "نشط" },
  { id: "EMP002", name: "فاطمة الزهراني", department: "الموارد البشرية", status: "نشط" },
  { id: "EMP003", name: "يوسف المنصوري", department: "التسويق", status: "في إجازة" },
  { id: "EMP004", name: "نورة الحمادي", department: "الهندسة", status: "نشط" },
  { id: "EMP005", name: "خالد العامري", department: "المالية", status: "نشط" },
  { id: "EMP006", name: "مريم الكعبي", department: "التسويق", status: "نشط" },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: "REC001", employeeName: "أحمد الفارسي", employeeId: "EMP001", timestamp: "08:05 ص", status: "حضور", avatar: "https://placehold.co/40x40.png?text=AF" },
  { id: "REC002", employeeName: "فاطمة الزهراني", employeeId: "EMP002", timestamp: "08:15 ص", status: "تأخر", avatar: "https://placehold.co/40x40.png?text=FZ" },
  { id: "REC003", employeeName: "نورة الحمادي", employeeId: "EMP004", timestamp: "08:30 ص", status: "حضور", avatar: "https://placehold.co/40x40.png?text=NH" },
  { id: "REC004", employeeName: "خالد العامري", employeeId: "EMP005", timestamp: "05:00 م", status: "انصراف", avatar: "https://placehold.co/40x40.png?text=KA" },
  { id: "REC005", employeeName: "مريم الكعبي", employeeId: "EMP006", timestamp: "04:45 م", status: "انصراف مبكر", avatar: "https://placehold.co/40x40.png?text=MK" },
  { id: "REC006", employeeName: "أحمد الفارسي", employeeId: "EMP001", timestamp: "05:02 م", status: "انصراف", avatar: "https://placehold.co/40x40.png?text=AF" },
];

export const getAttendanceStats = () => {
    const now = new Date();
    const isWorkHours = now.getHours() >= 8 && now.getHours() < 17;
    const present = isWorkHours ? employees.filter(e => e.status === 'نشط').length - 2 : 0;
    const late = isWorkHours ? 1 : 0;
    const absent = employees.length - present - late;

    return { present, late, absent };
}
