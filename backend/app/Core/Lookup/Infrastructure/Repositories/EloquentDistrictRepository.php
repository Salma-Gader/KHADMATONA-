<?php

namespace App\Core\Lookup\Infrastructure\Repositories;

use App\Core\Lookup\Domain\Contracts\DistrictRepositoryInterface;
use App\Core\Lookup\Domain\Models\District;
use App\Core\Support\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class EloquentDistrictRepository extends BaseRepository implements DistrictRepositoryInterface
{
    protected function model(): string
    {
        return District::class;
    }

    public function allWithTranslations(?int $cityId = null): Collection
    {
        return District::query()
            ->with('translations')
            ->when($cityId !== null, fn ($query) => $query->where('city_id', $cityId))
            ->orderBy('id')
            ->get();
    }
}
