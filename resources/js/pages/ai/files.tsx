import { useState } from 'react';
import type { FormEvent } from 'react';
import { FeatureLayout } from '@/components/ai/feature-layout';
import { ResultPanel } from '@/components/ai/result-panel';
import { useAiRequest } from '@/components/ai/use-ai-request';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import ai from '@/routes/ai';

type FileResult = {
    text: string;
};

export default function FilesPage() {
    const [prompt, setPrompt] = useState(
        'Analise o documento anexado e resuma os pontos principais.',
    );
    const [file, setFile] = useState<File | null>(null);
    const { data, error, processing, run } = useAiRequest<FileResult>(
        ai.files.run.url(),
    );

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('document', file);

        run(formData);
    };

    return (
        <FeatureLayout
            title="Análise de arquivo"
            description="Anexe um documento a um prompt para que o modelo o inspecione e responda com base no conteúdo — resumos, extração de dados ou perguntas e respostas sobre o arquivo."
            docsUrl="https://laravel.com/docs/13.x/ai-sdk#attachments"
            steps={[
                {
                    title: 'Entrada',
                    description:
                        'Você anexa um documento (PDF, texto, CSV…) e, opcionalmente, uma pergunta.',
                },
                {
                    title: 'Anexo',
                    description:
                        'O arquivo vira um anexo via Files\\Document::fromUpload() e acompanha o prompt.',
                },
                {
                    title: 'Processamento',
                    description:
                        'O agente DocumentAnalyzer lê o conteúdo do documento e responde com base nele.',
                },
                {
                    title: 'Saída',
                    description: 'Você recebe a análise em texto.',
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
                                <Label htmlFor="document">Documento</Label>
                                <Input
                                    id="document"
                                    type="file"
                                    accept=".pdf,.txt,.md,.csv,.doc,.docx"
                                    onChange={(event) =>
                                        setFile(event.target.files?.[0] ?? null)
                                    }
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    PDF, TXT, MD, CSV, DOC ou DOCX (até 10 MB).
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="prompt">
                                    Pergunta ou instrução
                                </Label>
                                <Textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(event) =>
                                        setPrompt(event.target.value)
                                    }
                                    rows={4}
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={processing || !file}
                            >
                                {processing && <Spinner />}
                                Analisar documento
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
                            <p className="text-sm whitespace-pre-wrap">
                                {data?.text}
                            </p>
                        </ResultPanel>
                    </CardContent>
                </Card>
            </div>
        </FeatureLayout>
    );
}

FilesPage.layout = {
    breadcrumbs: [
        { title: 'AI Lab', href: ai.index() },
        { title: 'Análise de arquivo', href: ai.files() },
    ],
};
