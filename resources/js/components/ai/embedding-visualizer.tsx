import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type EmbeddingVisualizerProps = {
    inputs: string[];
    embeddings: number[][];
    dimensions: number;
    tokens: number;
};

const PREVIEW_COUNT = 24;

function magnitude(vector: number[]): number {
    return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
}

/**
 * Standalone visualization of raw embedding vectors: dimensions, token cost,
 * per-vector magnitude, and the first values rendered as diverging bars.
 */
export function EmbeddingVisualizer({
    inputs,
    embeddings,
    dimensions,
    tokens,
}: EmbeddingVisualizerProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{embeddings.length} vetor(es)</Badge>
                <Badge variant="secondary">{dimensions} dimensões</Badge>
                <Badge variant="secondary">{tokens} tokens</Badge>
            </div>

            {embeddings.map((vector, index) => {
                const preview = vector.slice(0, PREVIEW_COUNT);
                const maxAbs = Math.max(
                    ...preview.map((value) => Math.abs(value)),
                    1e-6,
                );

                return (
                    <div
                        key={index}
                        className="flex flex-col gap-2 rounded-lg border p-3"
                    >
                        <p className="truncate text-sm font-medium">
                            {inputs[index] ?? `Entrada ${index + 1}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            magnitude ≈ {magnitude(vector).toFixed(4)} ·
                            primeiros {preview.length} de {vector.length}{' '}
                            valores
                        </p>

                        <div
                            className="flex h-16 items-center gap-0.5"
                            aria-hidden="true"
                        >
                            {preview.map((value, position) => (
                                <div
                                    key={position}
                                    className="flex flex-1 items-center justify-center"
                                    title={value.toFixed(5)}
                                >
                                    <div
                                        className={cn(
                                            'w-full rounded-sm',
                                            value >= 0
                                                ? 'bg-primary'
                                                : 'bg-muted-foreground/50',
                                        )}
                                        style={{
                                            height: `${Math.max(2, (Math.abs(value) / maxAbs) * 100)}%`,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <p className="overflow-x-auto font-mono text-xs whitespace-nowrap text-muted-foreground">
                            [
                            {preview
                                .map((value) => value.toFixed(4))
                                .join(', ')}
                            {vector.length > PREVIEW_COUNT ? ', …' : ''}]
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
