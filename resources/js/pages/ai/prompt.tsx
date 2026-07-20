import { useState } from 'react';
import type { FormEvent } from 'react';
import { FeatureLayout } from '@/components/ai/feature-layout';
import { ResultPanel } from '@/components/ai/result-panel';
import { useAiRequest } from '@/components/ai/use-ai-request';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import ai from '@/routes/ai';

type PromptResult = {
    text: string;
    model?: string | null;
    usage?: Record<string, number>;
};

export default function PromptPage() {
    const [prompt, setPrompt] = useState(
        'Explique em uma frase o que é o Laravel.',
    );
    const { data, error, processing, run } = useAiRequest<PromptResult>(
        ai.prompt.run.url(),
    );

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('prompt', prompt);

        run(formData);
    };

    return (
        <FeatureLayout
            title="Prompt básico"
            description="A forma mais simples de usar o SDK: enviar um texto a um agente e receber uma resposta em texto. Um agente é uma classe PHP com instruções de sistema e o trait Promptable."
            docsUrl="https://laravel.com/docs/13.x/ai-sdk#prompting"
            steps={[
                {
                    title: 'Entrada',
                    description: 'Você escreve um prompt em linguagem natural.',
                },
                {
                    title: 'Agente',
                    description:
                        'O prompt vai para o agente Assistant, que injeta suas instruções de sistema.',
                },
                {
                    title: 'Processamento',
                    description:
                        'O SDK chama o provedor (OpenAI) e aguarda a resposta de forma síncrona.',
                },
                {
                    title: 'Saída',
                    description:
                        'Você recebe $response->text, o modelo usado e a contagem de tokens.',
                },
            ]}
        >
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Entrada</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="prompt">Seu prompt</Label>
                                <Textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(event) =>
                                        setPrompt(event.target.value)
                                    }
                                    rows={6}
                                    required
                                    placeholder="Pergunte qualquer coisa…"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={processing || prompt.trim() === ''}
                            >
                                {processing && <Spinner />}
                                Enviar prompt
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
                            <div className="flex flex-col gap-3">
                                <p className="text-sm whitespace-pre-wrap">
                                    {data?.text}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {data?.model && (
                                        <Badge variant="secondary">
                                            modelo: {data.model}
                                        </Badge>
                                    )}
                                    {data?.usage?.prompt_tokens != null && (
                                        <Badge variant="secondary">
                                            entrada: {data.usage.prompt_tokens}{' '}
                                            tokens
                                        </Badge>
                                    )}
                                    {data?.usage?.completion_tokens != null && (
                                        <Badge variant="secondary">
                                            saída:{' '}
                                            {data.usage.completion_tokens}{' '}
                                            tokens
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </ResultPanel>
                    </CardContent>
                </Card>
            </div>
        </FeatureLayout>
    );
}

PromptPage.layout = {
    breadcrumbs: [
        { title: 'AI Lab', href: ai.index() },
        { title: 'Prompt básico', href: ai.prompt() },
    ],
};
