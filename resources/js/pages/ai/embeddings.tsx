import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { EmbeddingVisualizer } from '@/components/ai/embedding-visualizer';
import { FeatureLayout } from '@/components/ai/feature-layout';
import { ResultPanel } from '@/components/ai/result-panel';
import { useAiRequest } from '@/components/ai/use-ai-request';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import ai from '@/routes/ai';

type EmbeddingsResult = {
    embeddings: number[][];
    dimensions: number;
    tokens: number;
};

const MAX_INPUTS = 6;

export default function EmbeddingsPage() {
    const [inputs, setInputs] = useState<string[]>([
        'Napa Valley tem ótimos vinhos.',
        'Laravel é um framework PHP.',
    ]);
    const [submittedInputs, setSubmittedInputs] = useState<string[]>([]);
    const { data, error, processing, run } = useAiRequest<EmbeddingsResult>(
        ai.embeddings.run.url(),
    );

    const updateInput = (index: number, value: string) => {
        setInputs((current) =>
            current.map((input, position) =>
                position === index ? value : input,
            ),
        );
    };

    const addInput = () => {
        setInputs((current) =>
            current.length < MAX_INPUTS ? [...current, ''] : current,
        );
    };

    const removeInput = (index: number) => {
        setInputs((current) =>
            current.filter((_, position) => position !== index),
        );
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const filled = inputs
            .map((input) => input.trim())
            .filter((input) => input !== '');

        if (filled.length === 0) {
            return;
        }

        const formData = new FormData();
        filled.forEach((input) => formData.append('inputs[]', input));

        setSubmittedInputs(filled);
        run(formData);
    };

    return (
        <FeatureLayout
            title="Embeddings"
            description="Um embedding transforma um texto nas “coordenadas” do seu significado — como a latitude e longitude de um lugar no mapa. Textos com sentido parecido ganham coordenadas próximas, mesmo escritos com palavras diferentes. Como o computador só compara números, são essas coordenadas que permitem medir o quanto dois textos se parecem — a base da busca semântica e do RAG."
            docsUrl="https://laravel.com/docs/13.x/ai-sdk#embeddings"
            steps={[
                {
                    title: 'Entrada',
                    description:
                        'Você fornece um ou mais textos (uma palavra, frase ou parágrafo).',
                },
                {
                    title: 'Vetorização',
                    description:
                        'Cada texto vira uma longa lista de números — as coordenadas do seu significado.',
                },
                {
                    title: 'Processamento',
                    description:
                        'O modelo devolve centenas ou milhares desses números (as “dimensões”) para cada texto.',
                },
                {
                    title: 'Saída',
                    description:
                        'Mostramos essas coordenadas: quantas são, a magnitude e os primeiros valores.',
                },
            ]}
        >
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="text-base">
                        Ainda não entendeu?
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                    <ul className="ml-4 list-disc space-y-2">
                        <li>
                            <strong>Mapa de significados:</strong> imagine que
                            cada texto vira um ponto num mapa gigante. Pontos
                            próximos têm sentido parecido; distantes, sentidos
                            diferentes.
                        </li>
                        <li>
                            <strong>Exemplo:</strong> “gato” cai pertinho de
                            “gatinho” e bem longe de “avião”, mesmo sem
                            compartilhar nenhuma letra com o primeiro.
                        </li>
                        <li>
                            <strong>Por que números?</strong> o computador não
                            entende palavras, só números. As coordenadas deixam
                            o significado “calculável”: dá para medir a
                            distância entre dois textos.
                        </li>
                        <li>
                            <strong>O que os gráficos abaixo mostram:</strong>{' '}
                            cada barra é uma dessas coordenadas (uma dimensão).
                            Sozinha ela não quer dizer nada — o que importa é o
                            padrão completo, comparado ao de outro texto.
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Entrada</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Textos para vetorizar</Label>
                                {inputs.map((input, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <Input
                                            value={input}
                                            onChange={(event) =>
                                                updateInput(
                                                    index,
                                                    event.target.value,
                                                )
                                            }
                                            placeholder={`Entrada ${index + 1}`}
                                        />
                                        {inputs.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeInput(index)
                                                }
                                                aria-label="Remover entrada"
                                            >
                                                <X />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {inputs.length < MAX_INPUTS && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="self-start"
                                        onClick={addInput}
                                    >
                                        <Plus />
                                        Adicionar texto
                                    </Button>
                                )}
                            </div>
                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Gerar embeddings
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Saída</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResultPanel
                            processing={processing}
                            error={error}
                            hasResult={data !== null}
                        >
                            {data && (
                                <EmbeddingVisualizer
                                    inputs={submittedInputs}
                                    embeddings={data.embeddings}
                                    dimensions={data.dimensions}
                                    tokens={data.tokens}
                                />
                            )}
                        </ResultPanel>
                    </CardContent>
                </Card>
            </div>
        </FeatureLayout>
    );
}

EmbeddingsPage.layout = {
    breadcrumbs: [
        { title: 'AI Lab', href: ai.index() },
        { title: 'Embeddings', href: ai.embeddings() },
    ],
};
