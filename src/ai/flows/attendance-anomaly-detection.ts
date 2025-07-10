// The AI flow that detects attendance anomalies and alerts administrators.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttendanceAnomalyDetectionInputSchema = z.object({
  attendanceRecords: z.string().describe('A comprehensive record of employee attendance, including timestamps for clock-ins and clock-outs.'),
  employeeData: z.string().describe('Employee-specific data, including work schedules and absence history.'),
  companyPolicies: z.string().describe('Company-wide attendance policies and guidelines.'),
});

export type AttendanceAnomalyDetectionInput =
  z.infer<typeof AttendanceAnomalyDetectionInputSchema>;

const AttendanceAnomalyDetectionOutputSchema = z.object({
  anomalies: z
    .string()
    .describe(
      'A detailed report of any identified attendance anomalies, including the type of anomaly, affected employees, and potential reasons.'
    ),
  recommendations:
    z.string().describe('Recommended actions for administrators to address the identified anomalies, such as policy review or employee counseling.'),
});

export type AttendanceAnomalyDetectionOutput =
  z.infer<typeof AttendanceAnomalyDetectionOutputSchema>;

export async function detectAttendanceAnomalies(
  input: AttendanceAnomalyDetectionInput
): Promise<AttendanceAnomalyDetectionOutput> {
  return attendanceAnomalyDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'attendanceAnomalyDetectionPrompt',
  input: {schema: AttendanceAnomalyDetectionInputSchema},
  output: {schema: AttendanceAnomalyDetectionOutputSchema},
  prompt: `You are an AI assistant specialized in detecting anomalies in employee attendance records.

  Analyze the provided attendance records, employee data, and company policies to identify any unusual patterns or discrepancies.

  Provide a detailed report of the detected anomalies, including the type of anomaly, affected employees, and potential reasons.

  Recommend actions for administrators to address the identified anomalies.

  Attendance Records: {{{attendanceRecords}}}
  Employee Data: {{{employeeData}}}
  Company Policies: {{{companyPolicies}}}`,
});

const attendanceAnomalyDetectionFlow = ai.defineFlow(
  {
    name: 'attendanceAnomalyDetectionFlow',
    inputSchema: AttendanceAnomalyDetectionInputSchema,
    outputSchema: AttendanceAnomalyDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
