<?php

use App\Modules\Property\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('properties', PropertyController::class);
});
