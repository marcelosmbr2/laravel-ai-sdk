import { Link } from '@inertiajs/react';
import {
    Boxes,
    Database,
    FileSearch,
    ListOrdered,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { FeatureLayout } from '@/components/ai/feature-layout';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import ai from '@/routes/ai';

type ConceptCard = {
    icon: typeof Sparkles;
    title: string;
    body: ReactNode;
};

const concepts: ConceptCard[] = [
    {
        icon: Sparkles,
        title: 'O que é',
        body: (
            <>
                RAG (<em>Retrieval-Augmented Generation</em>, ou geração
                aumentada por recuperação) é uma técnica que{' '}
                <strong>
                    busca trechos relevantes de uma base de conhecimento e os
                    injeta no prompt
                </strong>{' '}
                antes de o modelo gerar a resposta. Em vez de confiar só no que
                o modelo "memorizou" no treinamento, a resposta é construída a
                partir de contexto recuperado na hora.
            </>
        ),
    },
    {
        icon: ShieldCheck,
        title: 'Para que serve',
        body: (
            <ul className="ml-4 list-disc space-y-1">
                <li>
                    <strong>Reduzir alucinações:</strong> o modelo responde
                    ancorado em fontes reais, não em suposições.
                </li>
                <li>
                    <strong>Conhecimento privado e atualizado:</strong> usar
                    seus próprios documentos (manuais, políticas, wikis) sem
                    precisar re-treinar o modelo.
                </li>
                <li>
                    <strong>Rastreabilidade:</strong> é possível mostrar de
                    quais trechos a resposta veio, permitindo citações.
                </li>
            </ul>
        ),
    },
];

export default function RagPage() {
    return (
        <FeatureLayout
            title="RAG"
            description="Geração aumentada por recuperação: combine uma base de conhecimento com um modelo de linguagem para respostas ancoradas em fontes. Esta página é conceitual — explica o que é, para que serve e como funciona; não há demonstração interativa."
            docsUrl="https://laravel.com/docs/13.x/ai-sdk#vector-stores"
            showConfigBanner={false}
            steps={[
                {
                    title: 'Ingestão',
                    description:
                        'Os documentos da base são divididos em pedaços menores (chunks) para caber no contexto e serem recuperados com precisão.',
                },
                {
                    title: 'Indexação',
                    description:
                        'Cada chunk vira um embedding (vetor) e é guardado em um índice/vector store. Fase offline, feita uma vez.',
                },
                {
                    title: 'Recuperação',
                    description:
                        'A pergunta do usuário também vira um embedding; por similaridade semântica recuperam-se os trechos mais próximos (top-K).',
                },
                {
                    title: 'Aumento',
                    description:
                        'Os trechos recuperados são inseridos no prompt como contexto, junto da pergunta original.',
                },
                {
                    title: 'Geração',
                    description:
                        'O agente responde usando esse contexto, mantendo-se fiel às fontes em vez de inventar.',
                },
            ]}
        >
            <div className="flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Ainda não entendeu?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-relaxed text-muted-foreground">
                        <ul className="ml-4 list-disc space-y-2">
                            <li>
                                <strong>Prova com consulta:</strong> em vez de
                                responder só “de cabeça” (e arriscar chutar), o
                                modelo primeiro procura os trechos certos no seu
                                material de apoio e responde olhando para eles.
                            </li>
                            <li>
                                <strong>Exemplo do dia a dia:</strong> é como um
                                atendente que, antes de responder, consulta o
                                manual da empresa. A resposta sai baseada no
                                manual, não em achismo.
                            </li>
                            <li>
                                <strong>Por que isso importa:</strong> sem
                                consultar, o modelo pode “inventar” (alucinar) ou
                                usar informação desatualizada; com a consulta,
                                ele se apoia em fontes reais e atuais.
                            </li>
                            <li>
                                <strong>Como ele acha o trecho certo:</strong>{' '}
                                usando{' '}
                                <Link
                                    href={ai.embeddings()}
                                    className="font-medium text-foreground underline underline-offset-4"
                                >
                                    embeddings
                                </Link>{' '}
                                — as “coordenadas de significado” — para
                                encontrar os pedaços mais parecidos com a
                                pergunta.
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    {concepts.map((concept) => (
                        <Card key={concept.title}>
                            <CardHeader>
                                <concept.icon className="mb-1 size-5 text-muted-foreground" />
                                <CardTitle className="text-base">
                                    {concept.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm leading-relaxed text-muted-foreground">
                                {concept.body}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Duas fases na prática
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground md:flex-row">
                        <div className="flex-1 rounded-lg border bg-muted/30 p-4">
                            <p className="mb-2 font-medium text-foreground">
                                Indexação (offline)
                            </p>
                            <p>
                                documentos → chunks → embeddings → índice
                                vetorial. Feita uma vez (ou quando a base muda).
                            </p>
                        </div>
                        <div className="flex-1 rounded-lg border bg-muted/30 p-4">
                            <p className="mb-2 font-medium text-foreground">
                                Consulta (runtime)
                            </p>
                            <p>
                                pergunta → embedding → busca por similaridade →
                                top-K trechos → prompt aumentado → resposta
                                ancorada.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            No Laravel AI SDK
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-relaxed text-muted-foreground">
                        <p className="mb-3">
                            O SDK oferece as peças para montar um pipeline de
                            RAG. Esta página é conceitual; abaixo, onde cada
                            etapa se encaixa:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <Boxes className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                <span>
                                    <strong>Embeddings</strong> — transformam
                                    texto (chunks e pergunta) em vetores. É a
                                    base da recuperação semântica. Veja a página{' '}
                                    <Link
                                        href={ai.embeddings()}
                                        className="font-medium text-foreground underline underline-offset-4"
                                    >
                                        Embeddings
                                    </Link>
                                    .
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <Database className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                <span>
                                    <strong>Vector Stores</strong> (
                                    <code>Stores</code>) — guardam e indexam os
                                    vetores dos seus arquivos no provedor.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <FileSearch className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                <span>
                                    <strong>Tool FileSearch</strong> — permite
                                    que um agente busque automaticamente nos
                                    vector stores durante a geração.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <ListOrdered className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                <span>
                                    <strong>Reranking</strong> — reordena os
                                    trechos recuperados por relevância para
                                    refinar o top-K (provedores Cohere e Jina).
                                </span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </FeatureLayout>
    );
}

RagPage.layout = {
    breadcrumbs: [
        { title: 'AI Lab', href: ai.index() },
        { title: 'RAG', href: ai.rag() },
    ],
};
