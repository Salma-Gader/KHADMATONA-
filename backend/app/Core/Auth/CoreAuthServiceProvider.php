<?php

namespace App\Core\Auth;

use Illuminate\Support\ServiceProvider;

class CoreAuthServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__.'/Database/Migrations');
    }
}
