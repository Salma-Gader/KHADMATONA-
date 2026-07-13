<?php

namespace App\Modules\Property;

use App\Modules\Property\Domain\Contracts\PropertyRepositoryInterface;
use App\Modules\Property\Infrastructure\Repositories\EloquentPropertyRepository;
use Illuminate\Support\ServiceProvider;

class PropertyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PropertyRepositoryInterface::class, EloquentPropertyRepository::class);
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/Database/Migrations');

        // Routes are required directly from routes/api.php (not via
        // loadRoutesFrom here) so they inherit the api/v1 prefix and
        // `api` middleware group set up in bootstrap/app.php.
    }
}
