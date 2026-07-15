<?php

namespace Database\Seeders;

use App\Core\Lookup\Database\Seeders\CitySeeder;
use App\Core\Permissions\Database\Seeders\PermissionSeeder;
use App\Models\User;
use App\Modules\Property\Database\Seeders\PropertySeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    // Deliberately not using WithoutModelEvents: spatie/laravel-permission
    // relies on model "created"/"deleted" events to invalidate its
    // permission cache, and this seeder is small enough that the
    // bulk-insert performance trait isn't worth fighting the package for.

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PermissionSeeder::class);
        $this->call(CitySeeder::class);

        if (! User::where('email', 'admin@khadmatona.test')->exists()) {
            $admin = User::factory()->create([
                'name' => 'KHADMATONA Admin',
                'email' => 'admin@khadmatona.test',
            ]);

            $admin->assignRole('Admin');
        }

        $this->call(PropertySeeder::class);
    }
}
