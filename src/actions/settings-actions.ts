
'use server';

import fs from "fs/promises";
import path from "path";
import type { DbData, JobTitle, Shift } from "@/lib/data";

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

async function writeDb(data: DbData): Promise<void> {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}


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
