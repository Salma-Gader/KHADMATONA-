<?php

namespace App\Modules\Property\Domain\Contracts;

use App\Core\Support\Contracts\RepositoryInterface;

interface PropertyRepositoryInterface extends RepositoryInterface
{
    /**
     * Aggregate figures for the dashboard overview - computed straight from
     * the properties table, not illustrative/hardcoded data.
     *
     * @return array{
     *     status_counts: array<string, int>,
     *     new_this_month: int,
     *     revenue_this_month: int,
     *     monthly_trend: array<int, array{month: string, count: int}>,
     * }
     */
    public function dashboardStats(): array;
}
