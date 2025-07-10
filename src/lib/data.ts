export type Employee = {
  id: string;
  name: string;
  department: string;
  status: "Active" | "On Leave";
};

export type AttendanceRecord = {
  id: string;
  employeeName: string;
  employeeId: string;
  timestamp: string;
  status: "Clocked In" | "Clocked Out" | "Late In" | "Early Out";
  avatar: string;
};

export const employees: Employee[] = [
  { id: "EMP001", name: "Ahmad Al-Farsi", department: "Engineering", status: "Active" },
  { id: "EMP002", name: "Fatima Al-Zahrani", department: "Human Resources", status: "Active" },
  { id: "EMP003", name: "Yusuf Al-Mansoori", department: "Marketing", status: "On Leave" },
  { id: "EMP004", name: "Noora Al-Hammadi", department: "Engineering", status: "Active" },
  { id: "EMP005", name: "Khalid Al-Ameri", department: "Finance", status: "Active" },
  { id: "EMP006", name: "Mariam Al-Kaabi", department: "Marketing", status: "Active" },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: "REC001", employeeName: "Ahmad Al-Farsi", employeeId: "EMP001", timestamp: "08:05 AM", status: "Clocked In", avatar: "https://placehold.co/40x40.png?text=AA" },
  { id: "REC002", employeeName: "Fatima Al-Zahrani", employeeId: "EMP002", timestamp: "08:15 AM", status: "Late In", avatar: "https://placehold.co/40x40.png?text=FZ" },
  { id: "REC003", employeeName: "Noora Al-Hammadi", employeeId: "EMP004", timestamp: "08:30 AM", status: "Clocked In", avatar: "https://placehold.co/40x40.png?text=NH" },
  { id: "REC004", employeeName: "Khalid Al-Ameri", employeeId: "EMP005", timestamp: "05:00 PM", status: "Clocked Out", avatar: "https://placehold.co/40x40.png?text=KA" },
  { id: "REC005", employeeName: "Mariam Al-Kaabi", employeeId: "EMP006", timestamp: "04:45 PM", status: "Early Out", avatar: "https://placehold.co/40x40.png?text=MK" },
  { id: "REC006", employeeName: "Ahmad Al-Farsi", employeeId: "EMP001", timestamp: "05:02 PM", status: "Clocked Out", avatar: "https://placehold.co/40x40.png?text=AA" },
];

export const getAttendanceStats = () => {
    const now = new Date();
    const isWorkHours = now.getHours() >= 8 && now.getHours() < 17;
    const present = isWorkHours ? employees.filter(e => e.status === 'Active').length - 2 : 0;
    const late = isWorkHours ? 1 : 0;
    const absent = employees.length - present - late;

    return { present, late, absent };
}
