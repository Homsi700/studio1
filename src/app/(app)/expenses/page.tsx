import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"

export default function ExpensesPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold">إدارة المصاريف</h1>
                <p className="text-muted-foreground">تسجيل وتتبع مصاريف المنشأة.</p>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>قيد الإنشاء</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>هذا القسم مخصص لتسجيل وإدارة المصاريف، وسيتم تفعيله قريباً.</p>
                </CardContent>
            </Card>
        </div>
    )
}
