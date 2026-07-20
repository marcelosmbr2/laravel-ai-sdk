<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;
use Stringable;

class DocumentAnalyzer implements Agent
{
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<<'INSTRUCTIONS'
        Você é um analista de documentos. O usuário anexa um arquivo (PDF, texto, markdown,
        CSV, etc.) e faz uma pergunta ou pede uma análise. Leia o documento anexado e responda
        com base no seu conteúdo, em português do Brasil. Seja objetivo: destaque os pontos
        principais, resuma quando pedirem e cite trechos relevantes quando ajudar na
        compreensão. Se a resposta não estiver no documento, diga isso claramente em vez de
        inventar informações.
        INSTRUCTIONS;
    }
}
