
'use server';

import fs from "fs/promises";
import path from "path";
import type { DbData, Leave } from "@/lib/data";
import { getEmployees } from "./employee-actions";

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

async function writeDb(data: DbData): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getLeaveRequests(): Promise<(Leave & { employeeName: string })[]> {
    const db = await readDb();
    const employees = await getEmployees();
    const employeeMap = new Map(employees.map(e => [e.id, e.name]));
    return db.leaves.map(leave => ({
        ...leave,
        employeeName: employeeMap.get(leave.employeeId) || 'غير معروف'
    }));
}

export async function addLeaveRequest(leaveData: Omit<Leave, 'id' | 'status'>): Promise<Leave> {
    const db = await readDb();
    const newLeave: Leave = {
        ...leaveData,
        id: `leave-${Date.now()}`,
        status: "قيد المراجعة"
    };
    db.leaves.push(newLeave);
    await writeDb(db);
    return newLeave;
}

export async function updateLeaveStatus(id: string, status: 'موافق عليه' | 'مرفوض'): Promise<Leave | undefined> {
    const db = await readDb();
    const leave = db.leaves.find(l => l.id === id);
    if (leave) {
        leave.status = status;
        // Optionally update employee status if leave is approved
        if (status === 'موافق عليه') {
            const employee = db.employees.find(e => e.id === leave.employeeId);
            if (employee) {
                // This is a simplification. A real system would check dates.
                employee.status = "في إجازة";
            }
        }
        await writeDb(db);
        return leave;
    }
    return undefined;
}

export async function deleteLeaveRequest(id: string): Promise<void> {
    const db = await readDb();
    db.leaves = db.leaves.filter(l => l.id !== id);
    await writeDb(db);
}
