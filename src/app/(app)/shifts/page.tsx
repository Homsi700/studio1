import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShiftsPage() {
    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold">إدارة الورديات</h1>
                <p className="text-muted-foreground">تخطيط وتعيين ورديات العمل للموظفين.</p>
            </header>
            <main>
                <Card>
                    <CardHeader>
                        <CardTitle>قيد الإنشاء</CardTitle>
                        <CardDescription>هذا القسم مخصص لإدارة ورديات العمل، وسيتم تفعيله قريباً.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>يمكنك هنا إنشاء ورديات جديدة، تعيينها للموظفين، وعرض جدول الورديات.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
