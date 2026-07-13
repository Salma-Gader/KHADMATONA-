<?php

use App\Modules\Lead\Http\Controllers\StoreLeadController;
use Illuminate\Support\Facades\Route;

// Public capture endpoint for visit/sell/rent/contact requests from the
// showcase site - rate-limited more strictly than reads (PROJECT_RULES.md
// §22).
Route::middleware('throttle:leads')->post('/leads', StoreLeadController::class);
