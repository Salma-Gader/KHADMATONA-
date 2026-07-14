<?php

use App\Modules\Lead\Http\Controllers\LeadController;
use App\Modules\Lead\Http\Controllers\StoreLeadController;
use Illuminate\Support\Facades\Route;

// Public capture endpoint for visit/sell/rent/contact requests from the
// showcase site - rate-limited more strictly than reads (PROJECT_RULES.md
// §22).
Route::middleware('throttle:leads')->post('/leads', StoreLeadController::class);

// Admin back-office: view, triage, and act on submitted leads.
Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
    Route::get('/leads', [LeadController::class, 'index']);
    Route::get('/leads/{lead}', [LeadController::class, 'show']);
    Route::patch('/leads/{lead}', [LeadController::class, 'updateStatus']);
    Route::delete('/leads/{lead}', [LeadController::class, 'destroy']);
});
