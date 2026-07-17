<?php

namespace App\Modules\Property\Http\Filters;

use App\Core\Support\QueryFilters\BaseQueryFilter;
use App\Modules\Property\Domain\Models\Property;
use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\AllowedFilter;

class PropertyFilter extends BaseQueryFilter
{
    protected function subject(): Builder
    {
        // PropertyResource always reads city/district/media - eager-loaded
        // here so the list endpoint never N+1s (mirrors
        // EloquentPropertyRepository's find()/findOrFail() overrides, which
        // cover the non-list endpoints this filter doesn't touch).
        return Property::query()->with(['city', 'district', 'media']);
    }

    /**
     * @return array<int, string|AllowedFilter>
     */
    protected function allowedFilters(): array
    {
        return [
            'status',
            'type',
            'city_id',
            AllowedFilter::callback('search', function ($query, $value) {
                $query->where('title', 'like', "%{$value}%");
            }),
            // Values arrive in MAD (the API's public unit - see
            // PropertyResource/PropertyController::toAttributes()) and are
            // converted to cents here to match the stored column.
            AllowedFilter::callback('price_min', function ($query, $value) {
                $query->where('price', '>=', (int) round($value * 100));
            }),
            AllowedFilter::callback('price_max', function ($query, $value) {
                $query->where('price', '<=', (int) round($value * 100));
            }),
        ];
    }

    /**
     * @return array<int, string>
     */
    protected function allowedSorts(): array
    {
        return ['created_at', 'price'];
    }
}
