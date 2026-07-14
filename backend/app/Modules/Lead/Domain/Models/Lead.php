<?php

namespace App\Modules\Lead\Domain\Models;

use App\Core\ActivityLog\Concerns\LogsAllChanges;
use App\Modules\Lead\Domain\Enums\LeadStatus;
use App\Modules\Lead\Domain\Enums\LeadType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * `property_id` is a plain foreign-key column (DB-level constraint set up
 * in the migration) rather than an Eloquent relationship - PROJECT_RULES.md
 * §3 forbids importing another business module's model class directly.
 * Resolving the related property, if ever needed, goes through the
 * Property module's own repository/contract, not a cross-module relation.
 */
class Lead extends Model
{
    use LogsAllChanges, SoftDeletes;

    protected $fillable = [
        'type',
        'status',
        'name',
        'email',
        'phone',
        'message',
        'property_id',
    ];

    protected function casts(): array
    {
        return [
            'type' => LeadType::class,
            'status' => LeadStatus::class,
        ];
    }
}
