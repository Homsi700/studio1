import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SalariesPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">إدارة الرواتب</h1>
                <p className="text-muted-foreground">حساب وتتبع رواتب الموظفين.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>قيد الإنشاء</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>هذا القسم مخصص لعرض وإدارة رواتب الموظفين، وسيتم تفعيله قريباً.</p>
                </CardContent>
            </Card>
        </div>
    )
}
