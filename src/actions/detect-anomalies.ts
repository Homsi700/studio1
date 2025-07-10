'use server';

import { detectAttendanceAnomalies } from '@/ai/flows/attendance-anomaly-detection';
import type { AttendanceAnomalyDetectionOutput } from '@/ai/flows/attendance-anomaly-detection';

const mockAttendanceData = {
    attendanceRecords: `
      - Employee EMP001 clocked in at 8:05 AM, clocked out at 5:02 PM.
      - Employee EMP002 clocked in at 8:15 AM (late), clocked out at 5:00 PM.
      - Employee EMP003 is on leave.
      - Employee EMP004 clocked in at 8:30 AM (late), clocked out at 4:30 PM (early).
      - Employee EMP005 clocked in at 8:00 AM, clocked out at 5:00 PM.
      - Employee EMP006 clocked in at 8:00 AM, clocked out at 4:45 PM (early).
      - Employee EMP002 has been late 3 times this week.
      - Employee EMP004 frequently leaves early on Fridays.
    `,
    employeeData: `
      - EMP001: Ahmad Al-Farsi, Engineering, Schedule: 8 AM - 5 PM
      - EMP002: Fatima Al-Zahrani, HR, Schedule: 8 AM - 5 PM
      - EMP003: Yusuf Al-Mansoori, Marketing, On Leave
      - EMP004: Noora Al-Hammadi, Engineering, Schedule: 8:30 AM - 5 PM
      - EMP005: Khalid Al-Ameri, Finance, Schedule: 8 AM - 5 PM
      - EMP006: Mariam Al-Kaabi, Marketing, Schedule: 8 AM - 5 PM
    `,
    companyPolicies: `
      - Official work hours are 8:00 AM to 5:00 PM.
      - A grace period of 10 minutes is allowed for clock-in.
      - Employees are expected to complete 8 working hours per day.
      - Leaving more than 15 minutes before 5:00 PM is considered an early departure.
    `,
};

export async function analyzeData(): Promise<AttendanceAnomalyDetectionOutput> {
    try {
        const result = await detectAttendanceAnomalies(mockAttendanceData);
        return result;
    } catch (error) {
        console.error("Error in AI analysis:", error);
        throw new Error("Failed to analyze attendance data.");
    }
}
