import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type Step = {
    title: string;
    description: string;
};

export function Steps({ steps }: { steps: Step[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Como funciona</CardTitle>
            </CardHeader>
            <CardContent>
                <ol className="flex flex-col gap-4">
                    {steps.map((step, index) => (
                        <li key={step.title} className="flex gap-3">
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                {index + 1}
                            </span>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm leading-tight font-medium">
                                    {step.title}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {step.description}
                                </span>
                            </div>
                        </li>
                    ))}
                </ol>
            </CardContent>
        </Card>
    );
}
