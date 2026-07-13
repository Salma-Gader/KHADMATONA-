<?php

namespace App\Modules\Property\Http\Filters;

use App\Core\Support\QueryFilters\BaseQueryFilter;
use App\Modules\Property\Domain\Models\Property;
use Spatie\QueryBuilder\AllowedFilter;

class PropertyFilter extends BaseQueryFilter
{
    protected function subject(): string
    {
        return Property::class;
    }

    /**
     * @return array<int, string|AllowedFilter>
     */
    protected function allowedFilters(): array
    {
        return [
            'status',
            'type',
            AllowedFilter::callback('search', function ($query, $value) {
                $query->where(function ($query) use ($value) {
                    $query->where('title', 'like', "%{$value}%")
                        ->orWhere('city', 'like', "%{$value}%");
                });
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
