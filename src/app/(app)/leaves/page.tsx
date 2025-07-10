import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeavesPage() {
    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold">إدارة الإجازات</h1>
                <p className="text-muted-foreground">تسجيل وتتبع وإدارة إجازات الموظفين.</p>
            </header>
            <main>
                <Card>
                    <CardHeader>
                        <CardTitle>قيد الإنشاء</CardTitle>
                        <CardDescription>هذا القسم مخصص لإدارة إجازات الموظفين، وسيتم تفعيله قريباً.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>يمكنك هنا إضافة، تعديل، والموافقة على طلبات الإجازات.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
