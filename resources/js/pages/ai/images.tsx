import { useState } from 'react';
import type { FormEvent } from 'react';
import { FeatureLayout } from '@/components/ai/feature-layout';
import { ResultPanel } from '@/components/ai/result-panel';
import { useAiRequest } from '@/components/ai/use-ai-request';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type ImageResult = {
    imageDataUri: string;
    mime: string;
};

export default function ImagesPage() {
    const [prompt, setPrompt] = useState(
        'Um donut sobre a bancada da cozinha, luz suave da manhã.',
    );
    const [aspect, setAspect] = useState('square');
    const [quality, setQuality] = useState('medium');
    const { data, error, processing, run } = useAiRequest<ImageResult>(
        ai.images.run.url(),
    );

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('aspect', aspect);
        formData.append('quality', quality);

        run(formData);
    };

    return (
        <FeatureLayout
            title="Imagens"
            description="Gere imagens a partir de uma descrição em texto. Você controla a proporção (quadrada, retrato, paisagem) e a qualidade da geração."
            docsUrl="https://laravel.com/docs/13.x/ai-sdk#images"
            steps={[
                {
                    title: 'Entrada',
                    description:
                        'Você descreve a imagem e escolhe proporção e qualidade.',
                },
                {
                    title: 'Geração',
                    description:
                        'Image::of(...)->generate() envia o prompt ao provedor de imagens (OpenAI).',
                },
                {
                    title: 'Processamento',
                    description:
                        'O modelo gera a imagem e devolve os bytes em Base64.',
                },
                {
                    title: 'Saída',
                    description:
                        'A imagem é exibida a partir de um data URI (base64).',
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
                                <Label htmlFor="prompt">
                                    Descrição da imagem
                                </Label>
                                <Textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(event) =>
                                        setPrompt(event.target.value)
                                    }
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Proporção</Label>
                                    <Select
                                        value={aspect}
                                        onValueChange={setAspect}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="square">
                                                Quadrada
                                            </SelectItem>
                                            <SelectItem value="portrait">
                                                Retrato
                                            </SelectItem>
                                            <SelectItem value="landscape">
                                                Paisagem
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Qualidade</Label>
                                    <Select
                                        value={quality}
                                        onValueChange={setQuality}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                Baixa
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Média
                                            </SelectItem>
                                            <SelectItem value="high">
                                                Alta
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={processing || prompt.trim() === ''}
                            >
                                {processing && <Spinner />}
                                Gerar imagem
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
                                <img
                                    src={data.imageDataUri}
                                    alt={prompt}
                                    className="w-full rounded-lg border"
                                />
                            )}
                        </ResultPanel>
                    </CardContent>
                </Card>
            </div>
        </FeatureLayout>
    );
}

ImagesPage.layout = {
    breadcrumbs: [
        { title: 'AI Lab', href: ai.index() },
        { title: 'Imagens', href: ai.images() },
    ],
};
