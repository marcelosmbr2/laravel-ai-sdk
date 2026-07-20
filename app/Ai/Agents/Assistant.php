<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Promptable;
use Stringable;

class Assistant implements Agent
{
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<<'INSTRUCTIONS'
        Você é um assistente prestativo de um laboratório de estudos do Laravel AI SDK.
        Responda de forma clara, direta e didática, em português do Brasil, a menos que o
        usuário peça explicitamente outro idioma. Quando fizer sentido, explique brevemente
        o raciocínio por trás da resposta.
        INSTRUCTIONS;
    }
}
