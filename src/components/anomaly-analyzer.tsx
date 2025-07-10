"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { analyzeData } from "@/actions/detect-anomalies";
import type { AttendanceAnomalyDetectionOutput } from "@/ai/flows/attendance-anomaly-detection";

export function AnomalyAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AttendanceAnomalyDetectionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysisResult = await analyzeData();
      setResult(analysisResult);
    } catch (err) {
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Attendance Data</CardTitle>
          <CardDescription>
            Use AI to scan for anomalies, discrepancies, and unusual patterns in your attendance records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAnalysis} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Run AI Analysis"
            )}
          </Button>
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="grid gap-6 lg:grid-cols-2">
            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Detected Anomalies</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap font-mono text-sm">
                    {result.anomalies}
                </AlertDescription>
            </Alert>
            <Alert className="border-green-500 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-800">Recommendations</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap font-mono text-sm text-green-700">
                    {result.recommendations}
                </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}
