<?php

use App\Modules\Property\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

// Public showcase site: unauthenticated listing/detail reads.
Route::middleware('throttle:public-read')->group(function () {
    Route::apiResource('properties', PropertyController::class)->only(['index', 'show']);
});

// Admin back-office: full CRUD behind Sanctum + the Admin role - a plain
// authenticated (but role-less, e.g. self-registered) user must not reach
// these.
Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::apiResource('properties', PropertyController::class)->except(['index', 'show']);
});
