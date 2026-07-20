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
import ai from '@/routes/ai';

type TranscriptionSegment = {
    text: string;
    speaker: string;
    start_seconds: number;
    end_seconds: number;
};

type TranscriptionResult = {
    text: string;
    segments: TranscriptionSegment[];
};

export default function TranscriptionPage() {
    const [file, setFile] = useState<File | null>(null);
    const [language, setLanguage] = useState('');
    const [diarize, setDiarize] = useState(false);
    const { data, error, processing, run } = useAiRequest<TranscriptionResult>(
        ai.transcription.run.url(),
    );

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('audio', file);
        formData.append('language', language);
        formData.append('diarize', diarize ? '1' : '0');

        run(formData);
    };

    return (
        <FeatureLayout
            title="Transcrições (STT)"
            description="Converta fala em texto (speech-to-text) a partir de um arquivo de áudio. Opcionalmente, segmente a transcrição por locutor com diarização."
            docsUrl="https://laravel.com/docs/13.x/ai-sdk#transcription"
            steps={[
                {
                    title: 'Entrada',
                    description:
                        'Você envia um arquivo de áudio e, se quiser, o idioma.',
                },
                {
                    title: 'Transcrição',
                    description:
                        'Transcription::fromUpload(...)->generate() envia o áudio ao provedor (OpenAI).',
                },
                {
                    title: 'Processamento',
                    description:
                        'Com diarize(), o texto também é segmentado por locutor.',
                },
                {
                    title: 'Saída',
                    description:
                        'Você recebe o texto transcrito (e os segmentos, se diarizado).',
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
                                <Label htmlFor="audio">Arquivo de áudio</Label>
                                <Input
                                    id="audio"
                                    type="file"
                                    accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg,.flac"
                                    onChange={(event) =>
                                        setFile(event.target.files?.[0] ?? null)
                                    }
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    MP3, WAV, M4A, WEBM, OGG ou FLAC (até 25
                                    MB).
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="language">
                                    Idioma (opcional, ISO-639-1)
                                </Label>
                                <Input
                                    id="language"
                                    value={language}
                                    onChange={(event) =>
                                        setLanguage(event.target.value)
                                    }
                                    placeholder="Ex.: pt, en, es"
                                    maxLength={10}
                                />
                            </div>
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={diarize}
                                    onChange={(event) =>
                                        setDiarize(event.target.checked)
                                    }
                                    className="size-4 rounded border-input accent-primary"
                                />
                                Diarizar (separar por locutor)
                            </label>
                            <Button
                                type="submit"
                                disabled={processing || !file}
                            >
                                {processing && <Spinner />}
                                Transcrever áudio
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
                            <div className="flex flex-col gap-4">
                                <p className="text-sm whitespace-pre-wrap">
                                    {data?.text}
                                </p>
                                {data?.segments && data.segments.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Segmentos por locutor
                                        </p>
                                        <ul className="flex flex-col gap-1.5">
                                            {data.segments.map(
                                                (segment, index) => (
                                                    <li
                                                        key={index}
                                                        className="rounded-md border px-3 py-2 text-sm"
                                                    >
                                                        <span className="font-medium">
                                                            {segment.speaker}
                                                        </span>{' '}
                                                        <span className="text-xs text-muted-foreground">
                                                            (
                                                            {segment.start_seconds.toFixed(
                                                                1,
                                                            )}
                                                            s –{' '}
                                                            {segment.end_seconds.toFixed(
                                                                1,
                                                            )}
                                                            s)
                                                        </span>
                                                        <p className="text-muted-foreground">
                                                            {segment.text}
                                                        </p>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </ResultPanel>
                    </CardContent>
                </Card>
            </div>
        </FeatureLayout>
    );
}

TranscriptionPage.layout = {
    breadcrumbs: [
        { title: 'AI Lab', href: ai.index() },
        { title: 'Transcrições (STT)', href: ai.transcription() },
    ],
};
