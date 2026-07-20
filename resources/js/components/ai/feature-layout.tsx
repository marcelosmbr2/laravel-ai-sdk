import { Head } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { OpenaiConfigBanner } from '@/components/ai/openai-config-banner';
import { Steps } from '@/components/ai/steps';
import type { Step } from '@/components/ai/steps';

type FeatureLayoutProps = {
    title: string;
    description: ReactNode;
    docsUrl: string;
    steps: Step[];
    children: ReactNode;
    showConfigBanner?: boolean;
};

/**
 * Didactic scaffold shared by every AI Lab feature page: a heading, a short
 * explanation, the "how it works" steps, and the interactive demo below.
 *
 * Set `showConfigBanner` to false on conceptual pages that never call the
 * provider, so the "configure your key" warning is not shown misleadingly.
 */
export function FeatureLayout({
    title,
    description,
    docsUrl,
    steps,
    children,
    showConfigBanner = true,
}: FeatureLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col gap-6 p-4">
                <header className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <a
                            href={docsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Documentação
                            <ExternalLink className="size-3.5" />
                        </a>
                    </div>
                    <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                </header>

                {showConfigBanner && <OpenaiConfigBanner />}

                <Steps steps={steps} />

                <div>{children}</div>
            </div>
        </>
    );
}
