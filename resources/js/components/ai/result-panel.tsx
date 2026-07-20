import { TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

type ResultPanelProps = {
    processing: boolean;
    error: string | null;
    hasResult: boolean;
    emptyLabel?: string;
    children: ReactNode;
};

/**
 * Shared "output" area for every AI Lab demo: renders a pulsing skeleton while
 * processing, a destructive alert on error, the result when present, or a muted
 * empty state otherwise.
 */
export function ResultPanel({
    processing,
    error,
    hasResult,
    emptyLabel = 'A saída aparecerá aqui depois que você executar a demonstração.',
    children,
}: ResultPanelProps) {
    if (processing) {
        return (
            <div className="flex flex-col gap-2" aria-busy="true">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>Não foi possível concluir</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (hasResult) {
        return <>{children}</>;
    }

    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
}
