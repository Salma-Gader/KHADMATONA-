<?php

namespace App\Modules\Property\Infrastructure\Repositories;

use App\Core\Support\Repositories\BaseRepository;
use App\Modules\Property\Domain\Contracts\PropertyRepositoryInterface;
use App\Modules\Property\Domain\Models\Property;

class EloquentPropertyRepository extends BaseRepository implements PropertyRepositoryInterface
{
    protected function model(): string
    {
        return Property::class;
    }
}
