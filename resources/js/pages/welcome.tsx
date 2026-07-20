import { Head, Link, usePage } from '@inertiajs/react';
import {
    AudioLines,
    BadgeCheck,
    Boxes,
    Database,
    ExternalLink,
    FileText,
    Image as ImageIcon,
    KeyRound,
    Library,
    ListChecks,
    MessageSquare,
    Mic,
    Search,
    Sparkles,
    TriangleAlert,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';

const features = [
    { title: 'Prompt básico', icon: MessageSquare },
    { title: 'Análise de arquivo', icon: FileText },
    { title: 'Imagens', icon: ImageIcon },
    { title: 'Áudio (TTS)', icon: AudioLines },
    { title: 'Transcrições (STT)', icon: Mic },
    { title: 'Embeddings', icon: Boxes },
    { title: 'RAG (conceitual)', icon: Library },
];

const capabilities = [
    { title: 'Agentes e texto', icon: MessageSquare },
    { title: 'Imagens', icon: ImageIcon },
    { title: 'Áudio e transcrição', icon: AudioLines },
    { title: 'Embeddings e reranking', icon: Boxes },
    { title: 'Vector stores', icon: Database },
];

const useCases = [
    {
        title: 'Atendimento e chatbots',
        description:
            'Assistentes com memória de conversa que respondem clientes e usuários 24/7.',
        icon: MessageSquare,
    },
    {
        title: 'Busca semântica e RAG',
        description:
            'Encontrar respostas dentro de bases de conhecimento internas — documentos, FAQ, wikis.',
        icon: Search,
    },
    {
        title: 'Análise de documentos',
        description:
            'Resumir e extrair pontos de contratos, relatórios e PDFs longos.',
        icon: FileText,
    },
    {
        title: 'Geração de conteúdo e imagens',
        description:
            'Rascunhos de texto, descrições e imagens para marketing e produto.',
        icon: ImageIcon,
    },
    {
        title: 'Voz e acessibilidade',
        description:
            'Ler conteúdo em áudio (TTS) e transcrever reuniões, entrevistas e áudios (STT).',
        icon: Mic,
    },
    {
        title: 'Extração e classificação',
        description:
            'Saída estruturada para categorizar, moderar e extrair campos de textos.',
        icon: ListChecks,
    },
];

function CodeBlock({ children }: { children: ReactNode }) {
    return (
        <code className="block overflow-x-auto rounded-md border bg-muted px-3 py-2 font-mono text-xs text-foreground">
            {children}
        </code>
    );
}

export default function Welcome() {
    const { auth, aiLab } = usePage().props;
    const configured = aiLab?.openaiConfigured;

    return (
        <>
            <Head title="AI Lab — Laravel AI SDK" />
            <div className="min-h-screen bg-background text-foreground">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-8 lg:py-16">
                    <header className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-2 font-semibold">
                            <Sparkles className="size-5 text-primary" />
                            AI Lab
                        </span>
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Button asChild size="sm">
                                    <Link href={dashboard()}>
                                        Ir para o Dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={login()}>Entrar</Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link href={register()}>Registrar</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </header>

                    {/* Hero */}
                    <section className="flex flex-col gap-4">
                        <Badge variant="secondary" className="w-fit">
                            Laravel AI SDK · laravel/ai
                        </Badge>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Um laboratório de estudo do Laravel AI SDK
                        </h1>
                        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                            O <strong>AI Lab</strong> é um playground didático
                            das funcionalidades de IA da Laravel. Cada página
                            explica o que a feature faz, mostra o passo a passo
                            (entrada → processo → saída) e deixa você
                            experimentar na prática. Provedor único:{' '}
                            <strong>OpenAI</strong>.
                        </p>
                    </section>

                    {/* O que é este projeto */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold tracking-tight">
                            O que é este projeto
                        </h2>
                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            Uma página por funcionalidade, acessível pelo sidebar
                            depois do login. As features disponíveis:
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {features.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="flex items-center gap-2 rounded-lg border bg-card p-3 text-sm"
                                >
                                    <feature.icon className="size-4 shrink-0 text-muted-foreground" />
                                    <span>{feature.title}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* O que é o Laravel AI SDK */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold tracking-tight">
                            O que é o Laravel AI SDK
                        </h2>
                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            O <code>laravel/ai</code> é o pacote oficial de IA da
                            Laravel. Ele oferece uma <strong>API unificada</strong>{' '}
                            — a mesma sintaxe para diferentes capacidades e
                            provedores (OpenAI, Anthropic, Gemini, entre outros).
                            Assim dá para trocar de provedor sem reescrever a
                            aplicação.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {capabilities.map((capability) => (
                                <span
                                    key={capability.title}
                                    className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
                                >
                                    <capability.icon className="size-3.5" />
                                    {capability.title}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Casos de uso reais */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold tracking-tight">
                            Casos de uso reais
                        </h2>
                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            Fora do laboratório, as mesmas capacidades resolvem
                            problemas de produto do dia a dia:
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {useCases.map((useCase) => (
                                <div
                                    key={useCase.title}
                                    className="flex gap-3 rounded-lg border bg-card p-4"
                                >
                                    <useCase.icon className="mt-0.5 size-5 shrink-0 text-primary" />
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-medium">
                                            {useCase.title}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            {useCase.description}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Por que OpenAI */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold tracking-tight">
                            Por que OpenAI?
                        </h2>
                        <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                            <p>
                                O lab usa <strong>um único provedor</strong> para
                                reduzir o atrito de estudo: basta{' '}
                                <strong>uma conta e uma chave</strong> para rodar
                                todas as demonstrações.
                            </p>
                            <p>
                                Entre os provedores suportados, a{' '}
                                <strong>OpenAI</strong> é a que, sozinha, cobre{' '}
                                <strong>todas</strong> as capacidades usadas aqui
                                — texto, imagens, áudio (TTS), transcrição (STT) e
                                embeddings. Outros cobrem só parte: imagens
                                existem apenas em OpenAI, Gemini e xAI; reranking,
                                apenas em Cohere e Jina.
                            </p>
                            <p>
                                Como o SDK é <strong>multi-provedor</strong>, isso
                                não prende o projeto: trocar de provedor depois é
                                questão de mudar a configuração e a chave — o
                                código das features permanece o mesmo.
                            </p>
                        </div>
                    </section>

                    {/* Antes de começar */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold tracking-tight">
                            Antes de começar
                        </h2>
                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            Configure a aplicação antes de fazer login e usar as
                            demonstrações:
                        </p>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <KeyRound className="size-4" />
                                    1. Chave da OpenAI (essencial)
                                </CardTitle>
                                <CardDescription>
                                    Este lab usa apenas a OpenAI. Sem a chave, as
                                    features retornam um aviso em vez de um
                                    resultado real.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <p className="text-sm text-muted-foreground">
                                    Adicione a chave no arquivo{' '}
                                    <code>.env</code>:
                                </p>
                                <CodeBlock>OPENAI_API_KEY=sk-...</CodeBlock>
                                {configured ? (
                                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        <BadgeCheck className="size-3.5" />
                                        OPENAI_API_KEY configurada
                                    </span>
                                ) : (
                                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                                        <TriangleAlert className="size-3.5" />
                                        OPENAI_API_KEY ainda não configurada
                                    </span>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Database className="size-4" />
                                    2. Banco de dados
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <p className="text-sm text-muted-foreground">
                                    Rode as migrações. O <code>--seed</code> é
                                    opcional e cria um admin de demonstração para
                                    uso local (<code>admin@app.com</code> /{' '}
                                    <code>password</code>):
                                </p>
                                <CodeBlock>php artisan migrate --seed</CodeBlock>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Boxes className="size-4" />
                                    3. Inicializar aplicação
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <p className="text-sm text-muted-foreground">
                                    Instale as dependências e suba o Vite:
                                </p>
                                <CodeBlock>npm install &amp;&amp; npm run build &amp;&amp; composer run dev</CodeBlock>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BadgeCheck className="size-4" />
                                    4. Conta e login
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <p className="text-sm text-muted-foreground">
                                    Crie uma conta (ou use o admin semeado em
                                    ambiente local), faça login e explore o AI
                                    Lab pelo sidebar.
                                </p>
                                {!auth.user && (
                                    <div className="flex flex-wrap gap-2">
                                        <Button asChild size="sm">
                                            <Link href={register()}>
                                                Criar conta
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Link href={login()}>Entrar</Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Rodapé */}
                    <footer className="flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground">
                        <a
                            href="https://laravel.com/docs/13.x/ai-sdk"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-fit items-center gap-1.5 transition-colors hover:text-foreground"
                        >
                            Documentação do Laravel AI SDK
                            <ExternalLink className="size-3.5" />
                        </a>
                        <p>Projeto de estudo — não é um produto de produção.</p>
                    </footer>
                </div>
            </div>
        </>
    );
}
