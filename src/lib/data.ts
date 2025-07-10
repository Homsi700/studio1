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
  id: string;
  name: string;
  department: string;
  jobTitle: string;
  shift: string;
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
  { id: "EMP001", name: "أحمد الفارسي", department: "الهندسة", jobTitle: "مهندس برمجيات", shift: "الوردية الصباحية", status: "نشط" },
  { id: "EMP002", name: "فاطمة الزهراني", department: "الموارد البشرية", jobTitle: "مدير موارد بشرية", shift: "الوردية الصباحية", status: "نشط" },
  { id: "EMP003", name: "يوسف المنصوري", department: "التسويق", jobTitle: "مسوق رقمي", shift: "الوردية المسائية", status: "في إجازة" },
  { id: "EMP004", name: "نورة الحمادي", department: "الهندسة", jobTitle: "مهندس برمجيات", shift: "الوردية الصباحية", status: "نشط" },
  { id: "EMP005", name: "خالد العامري", department: "المالية", jobTitle: "محاسب", shift: "دوام مرن", status: "نشط" },
  { id: "EMP006", name: "مريم الكعبي", department: "التسويق", jobTitle: "مسوق رقمي", shift: "الوردية المسائية", status: "نشط" },
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
    const present = isWorkHours ? 4 : 0;
    const late = isWorkHours ? 1 : 0;
    const absent = employees.filter(e => e.status === 'نشط').length - present - late;

    return { present, late, absent };
}

export const getEmployeesByStatus = (status: 'present' | 'late' | 'absent'): Employee[] => {
    const now = new Date();
    const isWorkHours = now.getHours() >= 8 && now.getHours() < 17;

    if (!isWorkHours) return [];
    const activeEmployees = employees.filter(e => e.status === 'نشط');

    if (status === 'present') {
        return activeEmployees.filter(e => e.id !== "EMP002");
    }
    if (status === 'late') {
        return activeEmployees.filter(e => e.id === "EMP002");
    }
    if (status === 'absent') {
         return employees.filter(e => e.status === "في إجازة");
    }

    return [];
}
