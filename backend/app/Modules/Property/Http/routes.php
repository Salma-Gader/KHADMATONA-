<?php

use App\Modules\Property\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

// Public showcase site: unauthenticated listing/detail reads.
Route::middleware('throttle:public-read')->group(function () {
    Route::apiResource('properties', PropertyController::class)->only(['index', 'show']);
});

// Admin back-office: full CRUD behind Sanctum.
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('properties', PropertyController::class)->except(['index', 'show']);
});
