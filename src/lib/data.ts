

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

export type DbData = {
    jobTitles: JobTitle[];
    shifts: Shift[];
    employees: Employee[];
    attendanceRecords: AttendanceRecord[];
}
