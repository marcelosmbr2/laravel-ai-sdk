import { Head, Link } from '@inertiajs/react';
import {
    AudioLines,
    Boxes,
    FileText,
    Image as ImageIcon,
    Library,
    MessageSquare,
    Mic,
} from 'lucide-react';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import ai from '@/routes/ai';

const features = [
    {
        title: 'Prompt básico',
        description:
            'Envie um texto a um agente e receba uma resposta em texto.',
        href: ai.prompt(),
        icon: MessageSquare,
    },
    {
        title: 'Análise de arquivo',
        description:
            'Anexe um documento a um prompt e deixe o modelo analisá-lo.',
        href: ai.files(),
        icon: FileText,
    },
    {
        title: 'Imagens',
        description: 'Gere imagens a partir de uma descrição em texto.',
        href: ai.images(),
        icon: ImageIcon,
    },
    {
        title: 'Áudio (TTS)',
        description: 'Converta texto em fala escolhendo voz e tom.',
        href: ai.audio(),
        icon: AudioLines,
    },
    {
        title: 'Transcrições (STT)',
        description:
            'Converta um arquivo de áudio em texto, com diarização opcional.',
        href: ai.transcription(),
        icon: Mic,
    },
    {
        title: 'Embeddings',
        description: 'Transforme texto em vetores e visualize o resultado.',
        href: ai.embeddings(),
        icon: Boxes,
    },
    {
        title: 'RAG',
        description:
            'Entenda como recuperar contexto de uma base para ancorar respostas.',
        href: ai.rag(),
        icon: Library,
    },
];

export default function AiIndex() {
    return (
        <>
            <Head title="AI Lab" />
            <div className="mx-auto flex h-full w-full max-w-5xl flex-1 flex-col gap-6 p-4">
                <header className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        AI Lab
                    </h1>
                    <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                        Um playground didático das funcionalidades do{' '}
                        <strong>Laravel AI SDK</strong>. Cada página explica o
                        que a feature faz, mostra o passo a passo e deixa você
                        experimentar entrada, processamento e saída na prática.
                    </p>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Link
                            key={feature.title}
                            href={feature.href}
                            className="group"
                        >
                            <Card className="h-full gap-3 transition-colors hover:border-primary/50 hover:bg-accent/40">
                                <CardHeader>
                                    <feature.icon className="mb-1 size-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                                    <CardTitle className="text-base">
                                        {feature.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

AiIndex.layout = {
    breadcrumbs: [{ title: 'AI Lab', href: ai.index() }],
};
