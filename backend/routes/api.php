<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Every module's routes are wired here - the single, reviewable manifest
// of what endpoints exist, alongside bootstrap/providers.php for modules.
require __DIR__.'/../app/Core/Localization/Http/routes.php';
require __DIR__.'/../app/Modules/Property/Http/routes.php';
require __DIR__.'/../app/Modules/Lead/Http/routes.php';
require __DIR__.'/../app/Modules/Lookup/Http/routes.php';
require __DIR__.'/../app/Modules/Settings/Http/routes.php';
