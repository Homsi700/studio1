
import fs from "fs/promises";
import path from "path";

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

type DbData = {
    jobTitles: JobTitle[];
    shifts: Shift[];
    employees: Employee[];
    attendanceRecords: AttendanceRecord[];
}

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

async function readDb(): Promise<DbData> {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return initial empty structure
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return {
                jobTitles: [],
                shifts: [],
                employees: [],
                attendanceRecords: []
            };
        }
        throw error;
    }
}

async function writeDb(data: DbData): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}


// Functions to interact with the data
export async function getJobTitles(): Promise<JobTitle[]> {
    const db = await readDb();
    return db.jobTitles;
}

export async function addJobTitle(name: string): Promise<JobTitle> {
    const db = await readDb();
    const newJobTitle: JobTitle = { id: `jt-${Date.now()}`, name };
    db.jobTitles.push(newJobTitle);
    await writeDb(db);
    return newJobTitle;
}

export async function updateJobTitle(id: string, name: string): Promise<JobTitle | undefined> {
    const db = await readDb();
    const jobTitle = db.jobTitles.find(jt => jt.id === id);
    if (jobTitle) {
        jobTitle.name = name;
        await writeDb(db);
        return jobTitle;
    }
    return undefined;
}

export async function deleteJobTitle(id: string): Promise<void> {
    const db = await readDb();
    db.jobTitles = db.jobTitles.filter(jt => jt.id !== id);
    await writeDb(db);
}

export async function getShifts(): Promise<Shift[]> {
    const db = await readDb();
    return db.shifts;
}

export async function addShift(name: string, time: string): Promise<Shift> {
    const db = await readDb();
    const newShift: Shift = { id: `sh-${Date.now()}`, name, time };
    db.shifts.push(newShift);
    await writeDb(db);
    return newShift;
}

export async function updateShift(id: string, name: string, time: string): Promise<Shift | undefined> {
    const db = await readDb();
    const shift = db.shifts.find(s => s.id === id);
    if (shift) {
        shift.name = name;
        shift.time = time;
        await writeDb(db);
        return shift;
    }
    return undefined;
}

export async function deleteShift(id: string): Promise<void> {
    const db = await readDb();
    db.shifts = db.shifts.filter(s => s.id !== id);
    await writeDb(db);
}

export async function getEmployees(): Promise<Employee[]> {
    const db = await readDb();
    return db.employees;
}

export async function addEmployee(employeeData: Omit<Employee, 'status'>): Promise<Employee> {
    const db = await readDb();
    const newEmployee: Employee = { ...employeeData, status: "نشط" };
    db.employees.push(newEmployee);
    await writeDb(db);
    return newEmployee;
}

export async function updateEmployee(employeeData: Employee): Promise<Employee | undefined> {
    const db = await readDb();
    const index = db.employees.findIndex(e => e.id === employeeData.id);
    if (index !== -1) {
        db.employees[index] = employeeData;
        await writeDb(db);
        return employeeData;
    }
    return undefined;
}

export async function deleteEmployee(id: string): Promise<void> {
    const db = await readDb();
    db.employees = db.employees.filter(e => e.id !== id);
    await writeDb(db);
}


export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
    const db = await readDb();
    return db.attendanceRecords;
}

export async function getAttendanceStats() {
    const db = await readDb();
    const { employees } = db;

    const now = new Date();
    const isWorkHours = now.getHours() >= 8 && now.getHours() < 17;
    if (!isWorkHours) return { present: 0, late: 0, absent: employees.filter(e => e.status === 'نشط').length };

    // This is mock logic, in a real app this would be based on real attendance data
    const presentIds = ["1001", "1004", "1005", "1006"];
    const lateIds = ["1002"];

    const present = employees.filter(e => e.status === 'نشط' && presentIds.includes(e.id)).length;
    const late = employees.filter(e => e.status === 'نشط' && lateIds.includes(e.id)).length;
    const absent = employees.filter(e => e.status === 'نشط' && !presentIds.includes(e.id) && !lateIds.includes(e.id)).length;


    return { present, late, absent };
}

export async function getEmployeesByStatus(status: 'present' | 'late' | 'absent'): Promise<Employee[]> {
    const db = await readDb();
    const { employees } = db;
    
    const now = new Date();
    const isWorkHours = now.getHours() >= 8 && now.getHours() < 17;
    const activeEmployees = employees.filter(e => e.status === 'نشط');

    if (!isWorkHours) {
        return status === 'absent' ? activeEmployees : [];
    }

    // This is mock logic, in a real app this would be based on real attendance data
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
