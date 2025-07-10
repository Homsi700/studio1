
export type JobTitle = {
  id: string;
  name: string;
};

export type Shift = {
  id: string;
  name: string;
  time: string; // e.g., "9ص - 5م"
};

export type Employee = {
  id: string; // This is now the 4-digit unique ID
  name: string;
  department: string;
  jobTitle: string;
  shift: string;
  status: "نشط" | "في إجازة";
};

export type AttendanceRecord = {
  id: string;
  employeeName: string;
  employeeId: string; // This will still hold the unique ID e.g. "1234"
  timestamp: string;
  status: "حضور" | "انصراف" | "تأخر" | "انصراف مبكر";
  avatar: string;
};

export const jobTitles: JobTitle[] = [
  { id: "jt-1", name: "مهندس برمجيات" },
  { id: "jt-2", name: "مدير موارد بشرية" },
  { id: "jt-3", name: "مسوق رقمي" },
  { id: "jt-4", name: "محاسب" },
];

export const shifts: Shift[] = [
  { id: "sh-1", name: "الوردية الصباحية", time: "8ص - 4م" },
  { id: "sh-2", name: "الوردية المسائية", time: "4م - 12ص" },
  { id: "sh-3", name: "دوام مرن", time: "غير محدد" },
];

export const employees: Employee[] = [
  { id: "1001", name: "أحمد الفارسي", department: "الهندسة", jobTitle: "مهندس برمجيات", shift: "الوردية الصباحية", status: "نشط" },
  { id: "1002", name: "فاطمة الزهراني", department: "الموارد البشرية", jobTitle: "مدير موارد بشرية", shift: "الوردية الصباحية", status: "نشط" },
  { id: "1003", name: "يوسف المنصوري", department: "التسويق", jobTitle: "مسوق رقمي", shift: "الوردية المسائية", status: "في إجازة" },
  { id: "1004", name: "نورة الحمادي", department: "الهندسة", jobTitle: "مهندس برمجيات", shift: "الوردية الصباحية", status: "نشط" },
  { id: "1005", name: "خالد العامري", department: "المالية", jobTitle: "محاسب", shift: "دوام مرن", status: "نشط" },
  { id: "1006", name: "مريم الكعبي", department: "التسويق", jobTitle: "مسوق رقمي", shift: "الوردية المسائية", status: "نشط" },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: "REC001", employeeName: "أحمد الفارسي", employeeId: "1001", timestamp: "08:05 ص", status: "حضور", avatar: "https://placehold.co/40x40.png?text=AF" },
  { id: "REC002", employeeName: "فاطمة الزهراني", employeeId: "1002", timestamp: "08:15 ص", status: "تأخر", avatar: "https://placehold.co/40x40.png?text=FZ" },
  { id: "REC003", employeeName: "نورة الحمادي", employeeId: "1004", timestamp: "08:30 ص", status: "حضور", avatar: "https://placehold.co/40x40.png?text=NH" },
  { id: "REC004", employeeName: "خالد العامري", employeeId: "1005", timestamp: "05:00 م", status: "انصراف", avatar: "https://placehold.co/40x40.png?text=KA" },
  { id: "REC005", employeeName: "مريم الكعبي", employeeId: "1006", timestamp: "04:45 م", status: "انصراف مبكر", avatar: "https://placehold.co/40x40.png?text=MK" },
  { id: "REC006", employeeName: "أحمد الفارسي", employeeId: "1001", timestamp: "05:02 م", status: "انصراف", avatar: "https://placehold.co/40x40.png?text=AF" },
];

export const getAttendanceStats = () => {
    const now = new Date();
    const isWorkHours = now.getHours() >= 8 && now.getHours() < 17;
    if (!isWorkHours) return { present: 0, late: 0, absent: employees.filter(e => e.status === 'نشط').length };

    const presentIds = ["1001", "1004", "1005", "1006"];
    const lateIds = ["1002"];

    const present = employees.filter(e => e.status === 'نشط' && presentIds.includes(e.id)).length;
    const late = employees.filter(e => e.status === 'نشط' && lateIds.includes(e.id)).length;
    const absent = employees.filter(e => e.status === 'نشط' && !presentIds.includes(e.id) && !lateIds.includes(e.id)).length;


    return { present, late, absent };
}

export const getEmployeesByStatus = (status: 'present' | 'late' | 'absent'): Employee[] => {
    const now = new Date();
    const isWorkHours = now.getHours() >= 8 && now.getHours() < 17;
    const activeEmployees = employees.filter(e => e.status === 'نشط');

    if (!isWorkHours) {
        return status === 'absent' ? activeEmployees : [];
    }

    const presentIds = ["1001", "1004", "1005", "1006"];
    const lateIds = ["1002"];

    if (status === 'present') {
        return activeEmployees.filter(e => presentIds.includes(e.id));
    }
    if (status === 'late') {
        return activeEmployees.filter(e => lateIds.includes(e.id));
    }
    if (status === 'absent') {
        return activeEmployees.filter(e => !presentIds.includes(e.id) && !lateIds.includes(e.id));
    }

    return [];
}
