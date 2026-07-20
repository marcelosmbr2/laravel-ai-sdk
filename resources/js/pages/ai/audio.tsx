import { useState } from 'react';
import type { FormEvent } from 'react';
import { FeatureLayout } from '@/components/ai/feature-layout';
import { ResultPanel } from '@/components/ai/result-panel';
import { useAiRequest } from '@/components/ai/use-ai-request';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import ai from '@/routes/ai';

type AudioResult = {
    audioDataUri: string;
    mime: string;
};

export default function AudioPage() {
    const [text, setText] = useState('Eu amo programar com Laravel.');
    const [gender, setGender] = useState('female');
    const [instructions, setInstructions] = useState('');
    const { data, error, processing, run } = useAiRequest<AudioResult>(
        ai.audio.run.url(),
    );

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('text', text);
        formData.append('gender', gender);
        formData.append('instructions', instructions);

        run(formData);
    };

    return (
        <FeatureLayout
            title="Áudio (TTS)"
            description="Converta texto em fala (text-to-speech). Escolha a voz e oriente o tom da narração com instruções livres."
            docsUrl="https://laravel.com/docs/13.x/ai-sdk#audio"
            steps={[
                {
                    title: 'Entrada',
                    description:
                        'Você digita o texto, escolhe a voz e dá instruções de tom.',
                },
                {
                    title: 'Síntese',
                    description:
                        'Audio::of(...)->generate() converte o texto em fala no provedor (OpenAI).',
                },
                {
                    title: 'Processamento',
                    description:
                        'O provedor devolve o áudio codificado em Base64.',
                },
                {
                    title: 'Saída',
                    description:
                        'Um player reproduz o áudio a partir de um data URI.',
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
                                <Label htmlFor="text">Texto</Label>
                                <Textarea
                                    id="text"
                                    value={text}
                                    onChange={(event) =>
                                        setText(event.target.value)
                                    }
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Voz</Label>
                                <Select
                                    value={gender}
                                    onValueChange={setGender}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="female">
                                            Feminina
                                        </SelectItem>
                                        <SelectItem value="male">
                                            Masculina
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="instructions">
                                    Instruções de tom (opcional)
                                </Label>
                                <Input
                                    id="instructions"
                                    value={instructions}
                                    onChange={(event) =>
                                        setInstructions(event.target.value)
                                    }
                                    placeholder="Ex.: falar de forma calma e acolhedora"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={processing || text.trim() === ''}
                            >
                                {processing && <Spinner />}
                                Gerar áudio
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
                                <audio
                                    controls
                                    src={data.audioDataUri}
                                    className="w-full"
                                >
                                    Seu navegador não suporta o elemento de
                                    áudio.
                                </audio>
                            )}
                        </ResultPanel>
                    </CardContent>
                </Card>
            </div>
        </FeatureLayout>
    );
}

AudioPage.layout = {
    breadcrumbs: [
        { title: 'AI Lab', href: ai.index() },
        { title: 'Áudio (TTS)', href: ai.audio() },
    ],
};
