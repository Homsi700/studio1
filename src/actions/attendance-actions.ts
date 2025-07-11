
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
                attendanceRecords: [],
                salaryRecords: [],
                expenses: [],
                leaves: []
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
    const { employees, attendanceRecords } = db;
    const activeEmployees = employees.filter(e => e.status === 'نشط');

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Filter today's attendance records
    const todaysRecords = attendanceRecords.filter(r => new Date(r.date).toISOString().split('T')[0] === today);
    
    const presentIds = new Set<string>();
    const lateIds = new Set<string>();

    todaysRecords.forEach(record => {
        if (record.status === 'حضور') {
            presentIds.add(record.employeeId);
        }
        if (record.status === 'تأخر') {
            lateIds.add(record.employeeId);
            presentIds.add(record.employeeId); // Late is also present
        }
    });

    const present = presentIds.size;
    const late = lateIds.size;
    
    const absent = activeEmployees.filter(e => !presentIds.has(e.id)).length;

    return { present, late, absent };
}

export async function getEmployeesByStatus(status: 'present' | 'late' | 'absent'): Promise<Employee[]> {
    const db = await readDb();
    const { employees, attendanceRecords } = db;
    const activeEmployees = employees.filter(e => e.status === 'نشط');
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const todaysRecords = attendanceRecords.filter(r => new Date(r.date).toISOString().split('T')[0] === today);

    const presentIds = new Set<string>();
    const lateIds = new Set<string>();

    todaysRecords.forEach(record => {
        if (record.status === 'حضور') {
            presentIds.add(record.employeeId);
        }
        if (record.status === 'تأخر') {
            lateIds.add(record.employeeId);
            presentIds.add(record.employeeId);
        }
    });

    if (status === 'present') {
        return activeEmployees.filter(e => presentIds.has(e.id) && !lateIds.has(e.id));
    }
    if (status === 'late') {
        return activeEmployees.filter(e => lateIds.has(e.id));
    }
    if (status === 'absent') {
        return activeEmployees.filter(e => !presentIds.has(e.id));
    }

    return [];
}
