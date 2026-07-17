<?php

use App\Modules\Blog\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

// Public showcase site: unauthenticated reads (published-only for guests;
// an authenticated Admin hitting these same routes also sees drafts - see
// PostController's class docblock). Same public-read limiter Property
// already registers.
Route::middleware('throttle:public-read')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{post:slug}', [PostController::class, 'show']);
});

// Admin back-office: full CRUD behind Sanctum + the Admin role. Numeric-id
// binding here (the default), distinct from the public route's slug binding
// above - the dashboard edit page links by id, not slug.
Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
});
