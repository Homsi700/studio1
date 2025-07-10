import { AnomalyAnalyzer } from "@/components/anomaly-analyzer";

export default function AnomaliesPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">كشف التجاوزات (AI)</h1>
                <p className="text-muted-foreground">تحليل ذكي لأنماط الحضور للكشف عن أي اختلافات.</p>
            </div>
            <AnomalyAnalyzer />
        </div>
    )
}
