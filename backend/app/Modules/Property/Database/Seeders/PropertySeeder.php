<?php

namespace App\Modules\Property\Database\Seeders;

use App\Modules\Property\Domain\Models\Property;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        if (Property::count() > 0) {
            return;
        }

        Property::factory()->count(20)->withGalleryPhoto()->create();
    }
}
