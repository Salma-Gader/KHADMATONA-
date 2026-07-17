<?php

namespace App\Modules\Lead;

use App\Modules\Lead\Domain\Contracts\LeadRepositoryInterface;
use App\Modules\Lead\Infrastructure\Repositories\EloquentLeadRepository;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class LeadServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LeadRepositoryInterface::class, EloquentLeadRepository::class);
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/Database/Migrations');

        // Routes are required directly from routes/api.php (not via
        // loadRoutesFrom here) so they inherit the api/v1 prefix and
        // `api` middleware group set up in bootstrap/app.php.

        // Public, unauthenticated capture endpoint - stricter than reads
        // (PROJECT_RULES.md §22), same pattern as CoreAuthServiceProvider's
        // 'auth' limiter.
        RateLimiter::for('leads', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
