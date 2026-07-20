import { usePage } from '@inertiajs/react';
import { TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function OpenaiConfigBanner() {
    const { aiLab } = usePage().props;

    if (aiLab?.openaiConfigured) {
        return null;
    }

    return (
        <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>OPENAI_API_KEY não configurada</AlertTitle>
            <AlertDescription>
                Defina OPENAI_API_KEY no seu arquivo .env para executar as
                demonstrações. Sem a chave, as chamadas retornam um aviso em vez
                de um resultado real.
            </AlertDescription>
        </Alert>
    );
}
