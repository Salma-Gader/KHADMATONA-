<?php

use App\Core\Auth\Http\Controllers\ForgotPasswordController;
use App\Core\Auth\Http\Controllers\LoginController;
use App\Core\Auth\Http\Controllers\LogoutController;
use App\Core\Auth\Http\Controllers\MeController;
use App\Core\Auth\Http\Controllers\RegisterController;
use App\Core\Auth\Http\Controllers\ResetPasswordController;
use App\Core\Auth\Http\Controllers\RoleController;
use App\Core\Auth\Http\Controllers\UserController;
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

// Admin management of *other* users' accounts - distinct from the /auth/*
// group above, which is about the current session only.
Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::get('/roles', RoleController::class);
});

// TEMPORARY - bootstraps the first Admin on a deploy target with no shell
// access (e.g. Render's free tier). Promotes one already-registered user
// (via POST /auth/register) to Admin, gated by a one-off secret compared
// with hash_equals(). DELETE THIS ROUTE right after using it once - it has
// no other access control and the secret lives in plain text below only
// because the route itself is meant to exist for minutes, not stay in the
// codebase.
Route::post('/_temp/promote-admin', function (\Illuminate\Http\Request $request) {
    abort_unless(
        hash_equals('b13d5490f28de7cd74815fe3ef16fbbf6dce0e628d32dfc6f40a0451a8b0a3cc', (string) $request->header('X-Admin-Secret', '')),
        403,
    );

    $user = \App\Models\User::where('email', $request->string('email'))->firstOrFail();
    $user->assignRole('Admin');

    return response()->json(['promoted' => $user->email]);
});
