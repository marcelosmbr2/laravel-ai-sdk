<?php

namespace App\Http\Controllers;

use App\Ai\Agents\Assistant;
use App\Ai\Agents\DocumentAnalyzer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Ai\Audio;
use Laravel\Ai\Embeddings;
use Laravel\Ai\Files\Document;
use Laravel\Ai\Image;
use Laravel\Ai\Transcription;
use Throwable;

class AiLabController extends Controller
{
    /**
     * Generate a text response from a basic prompt.
     */
    public function prompt(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'prompt' => ['required', 'string', 'max:4000'],
        ]);

        return $this->run(function () use ($validated) {
            $response = (new Assistant)->prompt($validated['prompt']);

            return [
                'text' => $response->text,
                'usage' => $response->usage->toArray(),
                'model' => $response->meta->model,
            ];
        });
    }

    /**
     * Analyze an uploaded document by attaching it to an agent prompt.
     */
    public function analyzeFile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'prompt' => ['nullable', 'string', 'max:2000'],
            'document' => ['required', 'file', 'mimes:pdf,txt,md,csv,doc,docx', 'max:10240'],
        ]);

        return $this->run(function () use ($request, $validated) {
            $response = (new DocumentAnalyzer)->prompt(
                $validated['prompt'] ?: 'Analise o documento anexado e resuma os pontos principais.',
                attachments: [Document::fromUpload($request->file('document'))],
            );

            return [
                'text' => $response->text,
                'usage' => $response->usage->toArray(),
            ];
        });
    }

    /**
     * Generate an image from a text prompt.
     */
    public function generateImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'prompt' => ['required', 'string', 'max:1000'],
            'aspect' => ['nullable', 'in:square,portrait,landscape'],
            'quality' => ['nullable', 'in:low,medium,high'],
        ]);

        return $this->run(function () use ($validated) {
            $image = Image::of($validated['prompt']);

            match ($validated['aspect'] ?? 'square') {
                'portrait' => $image->portrait(),
                'landscape' => $image->landscape(),
                default => $image->square(),
            };

            if (! empty($validated['quality'])) {
                $image->quality($validated['quality']);
            }

            $generated = $image->generate()->firstImage();

            return [
                'imageDataUri' => 'data:'.$generated->mime().';base64,'.$generated->image,
                'mime' => $generated->mime(),
            ];
        });
    }

    /**
     * Generate speech audio from text (TTS).
     */
    public function generateAudio(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'text' => ['required', 'string', 'max:2000'],
            'gender' => ['nullable', 'in:male,female'],
            'instructions' => ['nullable', 'string', 'max:500'],
        ]);

        return $this->run(function () use ($validated) {
            $audio = Audio::of($validated['text']);

            ($validated['gender'] ?? 'female') === 'male'
                ? $audio->male()
                : $audio->female();

            if (! empty($validated['instructions'])) {
                $audio->instructions($validated['instructions']);
            }

            $response = $audio->generate();

            $mime = $response->mimeType() ?? 'audio/mpeg';

            return [
                'audioDataUri' => 'data:'.$mime.';base64,'.$response->audio,
                'mime' => $mime,
            ];
        });
    }

    /**
     * Transcribe an uploaded audio file (STT).
     */
    public function transcribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'audio' => ['required', 'file', 'mimes:mp3,mpga,wav,m4a,webm,ogg,flac', 'max:25600'],
            'language' => ['nullable', 'string', 'max:10'],
            'diarize' => ['nullable', 'boolean'],
        ]);

        return $this->run(function () use ($request, $validated) {
            $transcription = Transcription::fromUpload($request->file('audio'));

            if (! empty($validated['language'])) {
                $transcription->language($validated['language']);
            }

            if ($request->boolean('diarize')) {
                $transcription->diarize();
            }

            $response = $transcription->generate();

            return [
                'text' => $response->text,
                'segments' => $response->segments->map(fn ($segment) => $segment->toArray())->all(),
            ];
        });
    }

    /**
     * Generate vector embeddings for one or more inputs.
     */
    public function embed(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'inputs' => ['required', 'array', 'min:1', 'max:10'],
            'inputs.*' => ['required', 'string', 'max:2000'],
        ]);

        return $this->run(function () use ($validated) {
            $response = Embeddings::for(array_values($validated['inputs']))->generate();

            return [
                'embeddings' => $response->embeddings,
                'dimensions' => count($response->embeddings[0] ?? []),
                'tokens' => $response->tokens,
            ];
        });
    }

    /**
     * Execute an AI call, returning a friendly JSON error when the provider is
     * not configured or the underlying request fails.
     *
     * @param  callable(): array<string, mixed>  $callback
     */
    protected function run(callable $callback): JsonResponse
    {
        if (blank(config('ai.providers.openai.key'))) {
            return response()->json([
                'error' => 'Defina OPENAI_API_KEY no seu arquivo .env para executar esta demonstração.',
            ], 422);
        }

        try {
            return response()->json($callback());
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'error' => 'A chamada ao provedor de IA falhou: '.$e->getMessage(),
            ], 422);
        }
    }
}
