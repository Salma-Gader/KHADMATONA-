<?php

namespace App\Core\Support\QueryFilters;

use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * Every module declares its own allow-listed filters/sorts/includes by
 * extending this instead of parsing query-string filtering, sorting,
 * and searching by hand in each controller.
 */
abstract class BaseQueryFilter
{
    public function __construct(protected Request $request) {}

    /**
     * @return class-string
     */
    abstract protected function subject(): string;

    /**
     * @return array<int, string|\Spatie\QueryBuilder\AllowedFilter>
     */
    abstract protected function allowedFilters(): array;

    /**
     * @return array<int, string>
     */
    protected function allowedSorts(): array
    {
        return [];
    }

    /**
     * @return array<int, string>
     */
    protected function allowedIncludes(): array
    {
        return [];
    }

    public function apply(): QueryBuilder
    {
        return QueryBuilder::for($this->subject(), $this->request)
            ->allowedFilters($this->allowedFilters())
            ->allowedSorts($this->allowedSorts())
            ->allowedIncludes($this->allowedIncludes());
    }
}
