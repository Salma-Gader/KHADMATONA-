<?php

use App\Core\Auth\Http\Controllers\ForgotPasswordController;
use App\Core\Auth\Http\Controllers\LoginController;
use App\Core\Auth\Http\Controllers\LogoutController;
use App\Core\Auth\Http\Controllers\MeController;
use App\Core\Auth\Http\Controllers\RegisterController;
use App\Core\Auth\Http\Controllers\ResetPasswordController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->name('auth.')->group(function () {
    // Public - rate-limited more strictly than authenticated endpoints
    // (PROJECT_RULES.md §22).
    Route::middleware('throttle:auth')->group(function () {
        Route::post('/register', RegisterController::class)->name('register');
        Route::post('/login', LoginController::class)->name('login');
        Route::post('/forgot-password', ForgotPasswordController::class)->name('password.email');
        Route::post('/reset-password', ResetPasswordController::class)->name('password.reset');
    });

    // Sanctum SPA session required.
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', LogoutController::class)->name('logout');
        Route::get('/me', MeController::class)->name('me');
    });
});
