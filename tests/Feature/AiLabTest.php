<?php

use App\Ai\Agents\Assistant;
use App\Ai\Agents\DocumentAnalyzer;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Ai\Audio;
use Laravel\Ai\Embeddings;
use Laravel\Ai\Image;
use Laravel\Ai\Transcription;

beforeEach(function () {
    config(['ai.providers.openai.key' => 'sk-test']);
});

test('guests are redirected from ai lab pages', function () {
    $this->get(route('ai.prompt'))->assertRedirect(route('login'));
});

test('authenticated users can view ai lab pages', function (string $routeName, string $component) {
    $this->actingAs(User::factory()->create());

    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['ai.index', 'ai/index'],
    ['ai.prompt', 'ai/prompt'],
    ['ai.files', 'ai/files'],
    ['ai.images', 'ai/images'],
    ['ai.audio', 'ai/audio'],
    ['ai.transcription', 'ai/transcription'],
    ['ai.embeddings', 'ai/embeddings'],
    ['ai.rag', 'ai/rag'],
]);

test('prompt endpoint returns generated text', function () {
    Assistant::fake(['Resposta gerada.']);
    $this->actingAs(User::factory()->create());

    $this->postJson(route('ai.prompt.run'), ['prompt' => 'Olá'])
        ->assertOk()
        ->assertJson(['text' => 'Resposta gerada.']);

    Assistant::assertPrompted('Olá');
});

test('prompt endpoint validates the prompt', function () {
    $this->actingAs(User::factory()->create());

    $this->postJson(route('ai.prompt.run'), [])
        ->assertStatus(422)
        ->assertJsonValidationErrors('prompt');
});

test('file analysis endpoint returns text based on the attachment', function () {
    DocumentAnalyzer::fake(['Resumo do documento.']);
    $this->actingAs(User::factory()->create());

    $file = UploadedFile::fake()->create('relatorio.pdf', 20, 'application/pdf');

    $this->post(route('ai.files.run'), ['document' => $file, 'prompt' => 'Resuma'], ['Accept' => 'application/json'])
        ->assertOk()
        ->assertJson(['text' => 'Resumo do documento.']);

    DocumentAnalyzer::assertPrompted('Resuma');
});

test('image endpoint returns a data uri', function () {
    Image::fake();
    $this->actingAs(User::factory()->create());

    $response = $this->postJson(route('ai.images.run'), [
        'prompt' => 'Um gato astronauta',
        'aspect' => 'square',
        'quality' => 'medium',
    ])->assertOk();

    expect($response->json('imageDataUri'))->toStartWith('data:');

    Image::assertGenerated(fn ($prompt) => $prompt->contains('gato'));
});

test('audio endpoint returns a data uri', function () {
    Audio::fake();
    $this->actingAs(User::factory()->create());

    $response = $this->postJson(route('ai.audio.run'), [
        'text' => 'Olá mundo',
        'gender' => 'female',
    ])->assertOk();

    expect($response->json('audioDataUri'))->toStartWith('data:');

    Audio::assertGenerated(fn ($prompt) => $prompt->contains('Olá'));
});

test('transcription endpoint returns text', function () {
    Transcription::fake(['Texto transcrito.']);
    $this->actingAs(User::factory()->create());

    // Minimal WAV bytes so the SDK's Base64Audio has real, non-empty content.
    $wav = 'RIFF'.pack('V', 36).'WAVEfmt '.pack('V', 16).pack('vvVVvv', 1, 1, 8000, 16000, 2, 16).'data'.pack('V', 0);
    $file = UploadedFile::fake()->createWithContent('fala.wav', $wav);

    $this->post(route('ai.transcription.run'), ['audio' => $file], ['Accept' => 'application/json'])
        ->assertOk()
        ->assertJson(['text' => 'Texto transcrito.']);
});

test('embeddings endpoint returns vectors', function () {
    Embeddings::fake();
    $this->actingAs(User::factory()->create());

    $response = $this->postJson(route('ai.embeddings.run'), [
        'inputs' => ['Napa Valley tem ótimos vinhos.', 'Laravel é um framework PHP.'],
    ])->assertOk();

    expect($response->json('embeddings'))->toHaveCount(2);
    expect($response->json('dimensions'))->toBeGreaterThan(0);

    Embeddings::assertGenerated(fn ($prompt) => $prompt->contains('Laravel'));
});

test('endpoints warn when the openai key is missing', function () {
    config(['ai.providers.openai.key' => null]);
    $this->actingAs(User::factory()->create());

    $this->postJson(route('ai.prompt.run'), ['prompt' => 'Olá'])
        ->assertStatus(422)
        ->assertJsonStructure(['error']);
});
