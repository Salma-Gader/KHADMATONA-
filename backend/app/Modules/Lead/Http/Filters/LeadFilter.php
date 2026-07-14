<?php

namespace App\Modules\Lead\Http\Filters;

use App\Core\Support\QueryFilters\BaseQueryFilter;
use App\Modules\Lead\Domain\Models\Lead;
use Spatie\QueryBuilder\AllowedFilter;

class LeadFilter extends BaseQueryFilter
{
    protected function subject(): string
    {
        return Lead::class;
    }

    /**
     * @return array<int, string|AllowedFilter>
     */
    protected function allowedFilters(): array
    {
        return [
            'type',
            'status',
            AllowedFilter::callback('search', function ($query, $value) {
                $query->where(function ($query) use ($value) {
                    $query->where('name', 'like', "%{$value}%")
                        ->orWhere('email', 'like', "%{$value}%");
                });
            }),
        ];
    }

    /**
     * @return array<int, string>
     */
    protected function allowedSorts(): array
    {
        return ['created_at'];
    }
}
