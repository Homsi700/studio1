
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
  salary: number;
  currency: 'USD' | 'SYP';
  status: "نشط" | "في إجازة";
};

export type SalaryRecord = {
    id: string;
    employeeId: string;
    amount: number;
    currency: 'USD' | 'SYP';
    payDate: string;
    period: 'monthly' | 'weekly';
}

export type Expense = {
    id: string;
    item: string;
    category: string;
    amount: number;
    currency: 'USD' | 'SYP';
    date: string;
}

export type Leave = {
    id: string;
    employeeId: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'قيد المراجعة' | 'موافق عليه' | 'مرفوض';
}

export type AttendanceRecord = {
  id: string;
  employeeName: string;
  employeeId: string; // This will still hold the unique ID e.g. "1234"
  timestamp: string;
  status: "حضور" | "انصراف" | "تأخر" | "انصراف مبكر";
  avatar: string;
  date: string; // YYYY-MM-DD
};

export type DbData = {
    jobTitles: JobTitle[];
    shifts: Shift[];
    employees: Employee[];
    attendanceRecords: AttendanceRecord[];
    salaryRecords: SalaryRecord[];
    expenses: Expense[];
    leaves: Leave[];
}
