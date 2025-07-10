
'use server';

import fs from "fs/promises";
import path from "path";
import type { DbData, Employee, JobTitle, Shift } from "@/lib/data";

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
                expenses: []
            };
        }
        throw error;
    }
}

async function writeDb(data: DbData): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getEmployees(): Promise<Employee[]> {
    const db = await readDb();
    return db.employees;
}

export async function getJobTitles(): Promise<JobTitle[]> {
    const db = await readDb();
    return db.jobTitles;
}

export async function getShifts(): Promise<Shift[]> {
    const db = await readDb();
    return db.shifts;
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
