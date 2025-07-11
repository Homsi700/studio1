
'use server';

import { detectAttendanceAnomalies } from '@/ai/flows/attendance-anomaly-detection';
import type { AttendanceAnomalyDetectionOutput } from '@/ai/flows/attendance-anomaly-detection';
import fs from "fs/promises";
import path from "path";
import type { DbData } from "@/lib/data";

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

const companyPolicies = `
  - Official work hours are 8:00 AM to 5:00 PM.
  - A grace period of 10 minutes is allowed for clock-in.
  - Employees are expected to complete 8 working hours per day.
  - Leaving more than 15 minutes before 5:00 PM is considered an early departure.
`;

export async function analyzeData(): Promise<AttendanceAnomalyDetectionOutput> {
    try {
        const db = await readDb();

        const attendanceRecordsString = db.attendanceRecords.map(r => 
            `- Employee ${r.employeeId} (${r.employeeName}) status is ${r.status} at ${r.timestamp} on ${r.date}.`
        ).join('\n');

        const employeeDataString = db.employees.map(e => 
            `- ${e.id}: ${e.name}, ${e.department}, Schedule: ${e.shift}`
        ).join('\n');

        const input = {
            attendanceRecords: attendanceRecordsString || "No attendance records found.",
            employeeData: employeeDataString || "No employee data found.",
            companyPolicies: companyPolicies
        };

        const result = await detectAttendanceAnomalies(input);
        return result;
    } catch (error) {
        console.error("Error in AI analysis:", error);
        throw new Error("Failed to analyze attendance data.");
    }
}
