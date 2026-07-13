<?php

namespace App\Modules\Lead\Infrastructure\Repositories;

use App\Core\Support\Repositories\BaseRepository;
use App\Modules\Lead\Domain\Contracts\LeadRepositoryInterface;
use App\Modules\Lead\Domain\Models\Lead;

class EloquentLeadRepository extends BaseRepository implements LeadRepositoryInterface
{
    protected function model(): string
    {
        return Lead::class;
    }
}
