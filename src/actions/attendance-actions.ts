
'use server';

import fs from "fs/promises";
import path from "path";
import type { DbData, AttendanceRecord, Employee } from "@/lib/data";

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

async function readDb(): Promise<DbData> {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
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
