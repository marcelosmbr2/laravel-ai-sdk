<?php

use App\Http\Controllers\AiLabController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('ai')->name('ai.')->group(function () {
        Route::inertia('/', 'ai/index')->name('index');

        Route::inertia('prompt', 'ai/prompt')->name('prompt');
        Route::post('prompt', [AiLabController::class, 'prompt'])->name('prompt.run');

        Route::inertia('files', 'ai/files')->name('files');
        Route::post('files', [AiLabController::class, 'analyzeFile'])->name('files.run');

        Route::inertia('images', 'ai/images')->name('images');
        Route::post('images', [AiLabController::class, 'generateImage'])->name('images.run');

        Route::inertia('audio', 'ai/audio')->name('audio');
        Route::post('audio', [AiLabController::class, 'generateAudio'])->name('audio.run');

        Route::inertia('transcription', 'ai/transcription')->name('transcription');
        Route::post('transcription', [AiLabController::class, 'transcribe'])->name('transcription.run');

        Route::inertia('embeddings', 'ai/embeddings')->name('embeddings');
        Route::post('embeddings', [AiLabController::class, 'embed'])->name('embeddings.run');

        Route::inertia('rag', 'ai/rag')->name('rag');
    });
});

require __DIR__.'/settings.php';
