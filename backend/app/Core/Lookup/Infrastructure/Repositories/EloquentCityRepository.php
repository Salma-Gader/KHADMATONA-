<?php

namespace App\Core\Lookup\Infrastructure\Repositories;

use App\Core\Lookup\Domain\Contracts\CityRepositoryInterface;
use App\Core\Lookup\Domain\Models\City;
use App\Core\Support\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;

class EloquentCityRepository extends BaseRepository implements CityRepositoryInterface
{
    protected function model(): string
    {
        return City::class;
    }

    public function allWithTranslations(): Collection
    {
        return City::query()->with('translations')->orderBy('id')->get();
    }
}
